import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getHypervisorUsage } from "../IronsightAPI";
import { BsZoomIn } from "react-icons/bs";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ color: "white" }}>
          {" "}
          CPU Usage: {` ${payload[0].value}`}%{" "}
        </div>
        <div style={{ color: "#8142FF" }}> Time: {label} </div>
      </div>
    );
  }

  return null;
};

export default function ReAreaChartMultiple() {
  const [isZoomed, setIsZoomed] = React.useState(true);
  const { data, isLoading, isError } = useQuery("hypervisor_usage", getHypervisorUsage, {
    // Refetch the data every 15 seconds
    refetchInterval: 15000,
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  // Make a GET request to the server to get the list of hostnames
  // and map them to a react-chartjs-2 chart
  // For every host in data.data.result, create a new dataset

  var results_list = data.data;
  var datasets = [];
  var labels = [];

  for (var i = 0; i < results_list.length; i++) {

    var result = results_list[i];
    var hostname = result.node;

    var chart_data_keys = result.data.map(function (data) {
      //   Convert the epoch time to a human readable date
      var date = new Date(data.time * 1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var formattedTime =
        hours + ":" + minutes.substr(-2);
      return formattedTime;
    });

    var chart_data_values = result.data.map(function (data) {
      return data['cpu'] * 100;
    });

    datasets.push({
      labels: hostname,
      data: chart_data_values,
    });
    labels = chart_data_keys;
  }

  // console.log("[Ironsight] Date(keys):", chart_data_keys);
  // console.log("[Ironsight] CPU Usage:", chart_data_values);
  // console.log("[Ironsight] DataSet0:", datasets[0]);
  // console.log("[Ironsight] DataSet1:", datasets[1]);

  // Map datasets into chart_data
  const chart_data = labels.map((x, y) => {
    return {
      labels: x,
      value1: datasets[0].data[y],
      value2: datasets[1].data[y],
    };
  });

  // Find the max value in the datasets
  var max_value = 0;
  for (var f = 0; f < datasets.length; f++) {
    var dataset = datasets[i];
    for (var j = 0; j < dataset.data.length; j++) {
      var value = dataset.data[j];
      if (value > max_value) {
        max_value = value;
      }
    }
  }

  // console.log("[Ironsight] Chart Data:", chart_data);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          width={800}
          height={500}
          data={chart_data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8142FF" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#8142FF" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#359EE5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#359EE5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="labels"
            type="category"
            interval={"preserveStartEnd" | "10"}
            tickCount={15}
            angle={-30}
            height={150}
            dy={30}
            dx={0}
          />
          <YAxis
            dataKey="value1"
            type="number"
            unit="%"
            domain={isZoomed ? [0, max_value + 2] : [0, 100]}
            scale="linear"
          />
          <Tooltip content={<CustomTooltip data={chart_data} />} />

          <Area
            type="monotone"
            dataKey="value1"
            stroke="#8142FF"
            fillOpacity={1}
            fill="url(#colorValue1)"
          />
          <Area
            type="monotone"
            dataKey="value2"
            stroke="#359EE5"
            fillOpacity={1}
            fill="url(#colorValue2)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-end">
        <button className="zoom-button" onClick={() => setIsZoomed(!isZoomed)}>
          <BsZoomIn />
        </button>
      </div>
    </div>
  );
}
