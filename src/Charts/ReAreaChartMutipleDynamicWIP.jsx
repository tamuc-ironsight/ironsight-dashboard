import React from 'react';
import { AreaChart,
     Area,
      XAxis,
       YAxis,
        Tooltip,
          ResponsiveContainer
        } from 'recharts';

import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getCPUUsage, getDocCount, getNetworkUsage } from "../IronsightAPI";


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">

        <div style={{ color: "#666568"}}> CPU Usage: {` ${payload[0].value}` + '%'} </div> 
        <div style={{ color: "#8142FF"}}> Time: {(label)} </div> 

      </div>
    );
  }

  return null;
};

export default function ReAreaChartMultiple2() {


   const { data: value1, isLoading: isLoadingValue1, isError: isErrorValue1 } = useQuery("cpu_usage", getCPUUsage);
   

  if (isLoadingValue1 ) {
      console.log("[Ironsight] Fetching Chart Data...");
      return <LinearProgress />;
  }

  if (isErrorValue1 ) {
      return <p>Error!</p>;
  }



    var results1_list = value1.data.result;
    var datasets = [];
    var labels = [];

    for (var i = 0; i < results1_list.length; i++) {

      var result = results1_list[i];
      var hostname = result.metric.instance;   //Label Server (string)
      
      //Get X data (time epoch values)
      var chart_data_keys = result.values.map(function (bucket) {
        //   Convert the epoch time to a human readable date
        var date = new Date(bucket[0] * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var formattedTime =
          hours + ":" + minutes.substr(-2);
        return formattedTime;
      });

        //Get Y data (values)
      var chart_data_values = 
    
        result.values.map(function(ybucket) 
              {
                  return parseFloat(ybucket[1] * 100);
              }
          );

      datasets.push({
        labels: hostname,
        data: chart_data_values
      })
      labels = chart_data_keys;
    }          

    console.log("[Ironsight] Date(keys):", chart_data_keys);
    console.log("[Ironsight] CPU Usage:",  chart_data_values);
    console.log("[Ironsight] DataSet0:",  datasets[0]);
    console.log("[Ironsight] DataSet1:",  datasets[1]);
    
    var chart_data = {
      //fill labels in with the buckets
      labels: labels, //x-axis
      datasets: datasets, //y-axis
    };

    console.log("[Ironsight] Chart Data:",  chart_data);
  

    return (
      
      <div style={{ width: '100%', height: 500 }}>
        <ResponsiveContainer>
          <AreaChart
            width={800}
            height={500}
            data={this.props.regionData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >

            <defs>
              <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8142FF" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#8142FF" stopOpacity={0}/>
              </linearGradient>

              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#359EE5" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#359EE5" stopOpacity={0}/>
              </linearGradient>

            </defs>

            <XAxis dataKey="labels" type="category" interval={'preserveStartEnd'| '10'} tickCount={15} angle={-30} height={150} dy={30}  dx={0} />
            <YAxis dataKey= "value1" type="number" unit="%" domain={[0, 'dataMax']} scale="linear" />
            <Tooltip content={<CustomTooltip data={chart_data} /> } />

            {/* <Area type="monotone" dataKey="labels" stroke="#8142FF" fillOpacity={1} fill="url(#colorValue1)" />
            <Area type="monotone" dataKey="labels" stroke="#359EE5" fillOpacity={1} fill="url(#colorValue2)" /> */}

            {
              this.props.regions.map((region) => {
                  return (<Area  name={region.name} key={`line_${region.name}`} stroke={region.color} dataKey={`${region.name}_value`} />)
               })
            }

          </AreaChart>
      </ResponsiveContainer>
    </div>
      );
}
