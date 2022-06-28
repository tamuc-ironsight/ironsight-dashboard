import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getDocCount } from "../IronsightAPI";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
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
  // console.log("[Ironsight] VM List:", chart_data_keys);

  // Get Y axis (values)
  var chart_data_values = data.aggregations.hostnames.buckets.map(function (
    bucket
  ) {
    return bucket.doc_count;
  });
  // console.log("[Ironsight] Doc Count:", chart_data_values);

  // Create the chart
  var chart_data = {
    //fill labels in with the buckets
    labels: chart_data_keys, //x-axis
    datasets: [
      {
        data: chart_data_values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 3,
      },
    ],
  };

  // console.log("[Ironsight] Chart Data:", chart_data);
  // console.log("[Ironsight] Loading complete");

  var options = {
    AnimationEffect: false,
    maintainAspectRatio: false,
  };

  return (
  <div>
    <Pie data={chart_data} height={400} options={options} />
  </div>
  );
};

export default PieChart;
