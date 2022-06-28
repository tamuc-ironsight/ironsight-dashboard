
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getDocCount } from "../IronsightAPI";



export default function ReLineChart() {

    

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
    bucket
  ) {
    return bucket.key;
  });
   console.log("[Ironsight] VM List:", chart_data_keys);

   //Get Y axis (values)
  var chart_data_values = data.aggregations.hostnames.buckets.map(function (
    bucket
  ) {
    return bucket.doc_count;
  });
   console.log("[Ironsight] Doc Count:", chart_data_values);

  var chart_data = [
      {
        labels: chart_data_keys,
        values: chart_data_values
        }, 
    ];

    console.log(chart_data)





  return (
    <LineChart
      width={900}
      height={700}
      data={chart_data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      
      <XAxis dataKey="labels" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="values"
        stroke="#8142FF"
        activeDot={{ r: 8 }}
      />
     
    </LineChart>
  );
}