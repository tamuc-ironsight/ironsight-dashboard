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
import { getDocCount } from "../IronsightAPI";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ color: "white" }}>
          {" "}
          Usage: {` ${payload[0].value}`}{" "}
        </div>
        <div style={{ color: "#8142FF" }}> VM: {label} </div>
      </div>
    );
  }

  return null;
};

export default function ReAreaChart() {
  const { data, isLoading, isError } = useQuery("doc_count", getDocCount);

  if (isLoading) {
    console.log("[Ironsight] Fetching Chart Data...");
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  // Make a GET request to the server to get the list of hostnames
  // and map them to a react-chartjs-2 chart

  var chart_data_keys = data.aggregations.hostnames.buckets.map(function (
    xbucket
  ) {
    return xbucket.key;
  });

  console.log("[Ironsight] VM List:", chart_data_keys);

  //Get Y axis (values)
  var chart_data_values = data.aggregations.hostnames.buckets.map(function (
    ybucket
  ) {
    return ybucket.doc_count;
  });

  console.log("[Ironsight] Doc Count:", chart_data_values);

  const chart_data = chart_data_keys.map((x, y) => {
    return { labels: x, values: chart_data_values[y] };
  });

  console.log("[Ironsight] Chart Data:", chart_data);

  return (
    <div style={{ width: "100%", height: 290 }}>
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
            domain={[0, "dataMax + 1000"]}
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
    </div>
  );
}
