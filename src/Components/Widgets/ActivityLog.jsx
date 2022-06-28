import React from "react";
import { useQuery } from "react-query";
import { getActivityLog } from "../../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";

const ActivityLog = () => {
  const { data, isLoading, isError } = useQuery(
    "activity_log",
    getActivityLog,
    {
      refetchInterval: 15000,
    }
  );

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  const get_activity_log = () => {
    return data.map(({ log_id, log_timestamp, log_username, log_activity }) => (
      <tr key={log_id}>
        <td>.</td>
        <td className="break-normal whitespace-normal">{log_timestamp}</td>
        <td className="break-normal whitespace-normal">{log_username}</td>
        <td className="break-normal whitespace-normal">{log_activity}</td>
      </tr>
    ));
  };
  const activity_log = get_activity_log();
  //   Reverse the order of the log
  const activity_log_reversed = activity_log.reverse();

  return (
    <div className="overflow-auto max-h-72">
      <table className="table w-full">
        <thead>
          <tr>
            <td></td>
            <th>Timestamp</th>
            <th>User</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>{activity_log_reversed}</tbody>
      </table>
    </div>
  );
};

export default ActivityLog;
