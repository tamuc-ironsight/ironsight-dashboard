import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getHypervisorUsage } from "../../../IronsightAPI";
import { BsZoomIn } from "react-icons/bs";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement);

const HypervisorMemoryWidget = () => {
  const [intervalMs, setIntervalMs] = React.useState(15000);
  const [isZoomed, setIsZoomed] = React.useState(true);
  const { data, isLoading, isError } = useQuery("hypervisor_usage", getHypervisorUsage, {
    // Refetch the data every 15 seconds
    refetchInterval: intervalMs,
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  if (data) {
    if (data['status'] == 'error') {
      return <p>Error!</p>;
    }
  }

  // Make a GET request to the server to get the list of hostnames
  // and map them to a react-chartjs-2 chart
  // For every host in data.data.result, create a new dataset

  var results_list = data.data;
  var datasets = [];
  var labels = [];
  var max_memory = results_list[0].data[0].memtotal / 1024 / 1024 / 1024;

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
      return data['memused'] / 1024 / 1024 / 1024;
    });
    datasets.push({
      label: hostname,
      data: chart_data_values,
      backgroundColor: [
        "rgba(100, 255, 100, 0.2)",
        "rgba(150, 150, 150, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
      ],
      borderColor: [
        "rgba(100, 255, 100, 1)",
        "rgba(150, 150, 150, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
      ],
      borderWidth: 3,
      elements: {
        point: {
          radius: 0,
        },
      },
    });
    labels = chart_data_keys;
  }

  // Create the chart
  var chart_data = {
    //fill labels in with the buckets
    labels: labels, //x-axis
    datasets: datasets,
  };

  var options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        autoskip: false,
        usePointStyle: false,
        // Set max to 100 unless zoomed in
        max: isZoomed ? null : max_memory,
        // Add GB to the y-axis label
        ticks: {
          callback: function (value, index, values) {
            return value + " GB";
          }
        }
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div>
      <div>
        <Line data={chart_data} height={280} options={options} />
      </div>

      <div className="flex justify-end">
        <button className="zoom-button" onClick={() => setIsZoomed(!isZoomed)}>
          <BsZoomIn />
        </button>
      </div>
    </div>
  );
};

export default HypervisorMemoryWidget;
