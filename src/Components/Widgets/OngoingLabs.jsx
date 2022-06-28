import React from "react";
import { useQuery } from "react-query";
import { getLabList } from "../../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";

const OngoingLabs = () => {
  const { data, isLoading, isError } = useQuery("lab_list", getLabList);

  if (isLoading) {
    console.log("[Ironsight] Fetching Chart Data...");
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  var lab_list = data.map(function (lab) {
    // Lab date_start and date_end are in the format of YYYY-MM-DD HH:MM:SS
    // If the lab is ongoing, it is between date_start and date_end
    // If the lab is finished, it is after date_end
    var date_start = new Date(lab.date_start);
    var date_end = new Date(lab.date_end);
    var today = new Date();
    var time_left = date_end - today;
    // Convert to human readable format (days, hours, minutes)
    var time_left_readable = { days: 0, hours: 0, minutes: 0 };
    time_left_readable.days = Math.floor(time_left / (1000 * 60 * 60 * 24));
    var class_name = lab.course_id;
    // Remove the underscore in class_name and Capitalize all letters
    class_name = class_name.replace("_", " ");
    class_name = class_name.toUpperCase();

    if (today >= date_start && today <= date_end) {
      return (
        <tr key={lab.lab_num} className="hover">
          <td>
            <Link
              className="w-full"
              to={"/lab_details/" + lab.lab_num}
              key={lab.lab_num}
            >
              {lab.lab_name}
            </Link>
          </td>
          <td>{class_name}</td>
          <td>{time_left_readable.days} days</td>
        </tr>
      );
    }
  });

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Time Left</th>
          </tr>
        </thead>
        <tbody className="w-full">{lab_list}</tbody>
      </table>
    </div>
  );
};

export default OngoingLabs;
