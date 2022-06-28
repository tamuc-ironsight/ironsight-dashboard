//...
import Progressbar from "react-js-progressbar";
import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getMetrics } from "../IronsightAPI";

const CPUProgress = () => {
  const { data, isLoading, isError } = useQuery("get_metrics", getMetrics, {
    // Refetch the data every 10 seconds
    refetchInterval: 10000,
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  var metrics_data = data.data;
  var cpu_usage = [];
  for (var i = 0; i < metrics_data.length; i++) {

    var cpu = metrics_data[i].metadata.fields[1].split("n");
    var temp = cpu[0] / 1024;
    cpu_usage.push(temp.toFixed(2));
  }

  var sum = 0;
  for (var av = 0; av < cpu_usage.length; av++) {
    sum += parseFloat(cpu_usage[av]);
  }

  var average_cpu = sum / cpu_usage.length;
  var Percentage = (average_cpu / sum) * 100;

  return (
    <div id="progressbarContainer">
      <Progressbar
        input={Percentage}
        pathWidth={10}
        pathColor={["#e56135", "#35e567"]} // use an array for gradient color.
        trailWidth={20}
        trailColor="#363636" // use a string for solid color.
        textStyle={{ fill: "white" }} // middle text style
        size={100}
      ></Progressbar>

    <div className="mt-4">
      CPU Usage: {(sum / 1000).toFixed(2)} millicores
      </div>
    </div>
  );
};

export default CPUProgress;
