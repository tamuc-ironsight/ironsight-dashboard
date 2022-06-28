import React from 'react'
import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import {getMetrics} from "../../../IronsightAPI";

const VMsOnWidget = () => {
    const [intervalMs, setIntervalMs] = React.useState(10000);
    const { data, isLoading, isError } = useQuery("get_metrics", getMetrics, {
      // Refetch the data every 10 seconds
      refetchInterval: intervalMs,
    });
  
    if (isLoading) {
      return <LinearProgress />;
    }

    if (isError) {
      return <p>Error!</p>;
    }

    var metrics_data = data.data;
    var hostname = [];
    var cpu_usage = [];
    var memory_usage = [];
    for (var i = 0; i < metrics_data.length; i++) {
      hostname.push(metrics_data[i].id);

      var memory = metrics_data[i].metadata.fields[2].split("Ki"); 
      var temp = memory[0]/(1024*1024);
      memory_usage.push(temp.toFixed(2));

      var cpu = metrics_data[i].metadata.fields[1].split("n");
      temp = cpu[0]/1024;
      cpu_usage.push(temp.toFixed(2));
      
    }

   console.log(memory_usage)
         
    return (
        
            <table className='table table-striped' border="1">
                <tr>
                    <th>Hosts</th>
                    <th>CPU Usage</th>
                    <th>Memory Usage</th>
                </tr>
                <tr>
                    <td>{hostname}</td>
                    <td>{cpu_usage}</td>
                    <td>{memory_usage}</td>
                
                
                </tr>

            </table>
        

      )
    
  

 
    
};

export default VMsOnWidget;