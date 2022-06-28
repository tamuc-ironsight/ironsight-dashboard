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
import { getVMNetworkPacketsReceived } from "../../../IronsightAPI";
import { BsZoomIn } from "react-icons/bs";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div style={{ color: "white" }}>
          {" "}
          Packets Received: {` ${payload[0].value}`}{" "}
        </div>
        <div style={{ color: "#359EE5" }}> Time: {label} </div>
      </div>
    );
  }

  return null;
};

const VMNetworkReceivedWidget = ({ vm_name }) => {
  const [intervalMs, setIntervalMs] = React.useState(15000);
  const [isZoomed, setIsZoomed] = React.useState(true);
  const { data, isLoading, isError } = useQuery("vm_network_packets_received", getVMNetworkPacketsReceived, {
    // Refetch the data every 15 seconds
    refetchInterval: intervalMs,
  });

  if (isLoading) {
    console.log("[Ironsight] Fetching VM Network Packets Data...");
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  var chart_data_keys = [];
  var chart_data_values = [];
  var results_list = data.data.result;

  for (var i = 0; i < results_list.length; i++) {
    var result = results_list[i];
    var hostname = result.metric.name;
    // If vm_name is specified, only show the data for that VM
    if (vm_name && hostname != vm_name) {
      continue;
    }
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
  }

  const chart_data = chart_data_keys.map((x, y) => {
    return { labels: x, values: chart_data_values[y] };
  });

  return (
    <div className="w-full">
      <div style={{ width: "100%", height: 290 }}>
      <div className="text-center text-sm mb-4">
        Packets Received
        </div>
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
              <linearGradient id="colorValues2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#359EE5" stopOpacity={0.5} />
                <stop offset="80%" stopColor="#359EE5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="labels"
              interval={20}
              angle={-30}
              height={150}
              dy={16}
              dx={0}
              tick={{ fontSize: "16px" }}
            />
            <YAxis
              dataKey="values"
              type="number"
              domain={isZoomed ? [0, "dataMax + 0.5"] : [0, 100]}
              scale="linear"
              // Add % to the Y axis
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip data={chart_data} />} />
            <Area
              type="monotone"
              dataKey="values"
              stroke="#359EE5"
              fillOpacity={1}
              fill="url(#colorValues2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* <div className="flex justify-end">
        <button className="zoom-button" onClick={() => setIsZoomed(!isZoomed)}>
          <BsZoomIn />
        </button>
      </div> */}
    </div>
  );
};

export default VMNetworkReceivedWidget;
