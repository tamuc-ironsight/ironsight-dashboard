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
import { getCPUUsage } from "../IronsightAPI";
import { BsZoomIn } from "react-icons/bs";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    //   Convert value to 2 decimal places
    var value = payload[0].value.toFixed(2);
    return (
      <div className="custom-tooltip">
        <div style={{ color: "white" }}>
          {" "}
          CPU Usage: {` ${value}`}{"%"}
        </div>
        <div style={{ color: "#8142FF" }}> Time: {label} </div>
      </div>
    );
  }

  return null;
};

const ReAreaChartCPU = () => {
  const [intervalMs, setIntervalMs] = React.useState(15000);
  const { data, isLoading, isError } = useQuery("cpu_usage", getCPUUsage, {
    // Refetch the data every 15 seconds
    refetchInterval: intervalMs,
  });
  const [isZoomed, setIsZoomed] = React.useState(true);

  if (isLoading) {
    console.log("[Ironsight] Fetching CPU Data...");
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  // Make a GET request to the server to get the list of hostnames
  // and map them to a react-chartjs-2 chart

  var results_list = data.data.result;
  var result = results_list[0];
  var hostname = result.metric.instance;
  var chart_data_keys = result.values.map(function (bucket) {
    //   Convert the epoch time to a human readable date
    var date = new Date(bucket[0] * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedTime;
  });
  var chart_data_values = result.values.map(function (bucket) {
    return bucket[1] * 100;
  });

  const chart_data = chart_data_keys.map((x, y) => {
    return { labels: x, values: chart_data_values[y] };
  });

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chart_data}
          margin={{
            top: 0,
            right: 50,
            left: 10,
            bottom: -60,
          }}
        >
          <defs>
            <linearGradient id="colorValues" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8142FF" stopOpacity={0.5} />
              <stop offset="80%" stopColor="#8142FF" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="labels"
            interval={0}
            angle={-30}
            height={150}
            dy={30}
            dx={0}
          />
          <YAxis
            dataKey="values"
            type="number"
            domain={isZoomed ? [0, "dataMax + 2"] : [0, 100]}
            scale="linear"
          />
          <Tooltip content={<CustomTooltip data={chart_data} />} />
          <Area
            type="monotone"
            dataKey="values"
            stroke="#8142FF"
            fillOpacity={1}
            fill="url(#colorValues)"
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
};

export default ReAreaChartCPU;
