import React from 'react'
import LinearProgress from "@mui/material/LinearProgress";
import { useQuery } from "react-query";
import { getNumVMs } from "../../../IronsightAPI";

const VMsOnWidget = () => {
    const [intervalMs, setIntervalMs] = React.useState(10000);
    const { data, isLoading, isError } = useQuery("num_vms", getNumVMs, {
      // Refetch the data every 10 seconds
      refetchInterval: intervalMs,
    });
  
    if (isLoading) {
      return <LinearProgress />;
    }
  
    if (isError) {
      return <p>Error!</p>;
    }
  return (
    <div className="mb1">
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">Total VMs</div>
        <div className="stat-value">{data}</div>
      </div>
    </div>
  </div>
  )
}

export default VMsOnWidget