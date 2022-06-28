import React from "react";
import "../../App.css";
import { useQuery } from "react-query";
import { getLabList } from "../../IronsightAPI";
import { Link } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";

const LabTable = ({ course_id, user_name }) => {
  const { data, isLoading, isError } = useQuery("lab_list", getLabList);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  var lab_data = data;

  // Filter the the labs, only show labs that have the user_name in users[]
  var filtered_lab_data = lab_data.filter(function (lab) {
    if (!course_id && !user_name) {
      return true;
    }
    if (course_id && user_name) {
      if (lab["course_id"] === course_id && lab["users"].includes(user_name)) {
        return true;
      }
    }
    if (course_id && !user_name) {
      if (lab["course_id"] === course_id) {
        return true;
      }
    }
    if (!course_id && user_name) {
      if (lab["users"].includes(user_name)) {
        return true;
      }
    }
    return false;
  });

  lab_data = filtered_lab_data;

  //   Take the raw JSON and turn it into the rows of the table
  var lab_html = lab_data.map(function (lab) {
    var lab_link = "/lab_details/" + lab.lab_num;
    if (user_name !== undefined) {
      lab_link += "/" + user_name;
    }
    return (
      <tr key={lab.lab_num} className="hover">
        <td>
          <Link className="w-full" to={lab_link} key={lab.lab_num}>
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-bold">{lab.lab_name}</div>
              </div>
            </div>
          </Link>
        </td>
        <td>
          <div>
            <p className="w-48 xl:w-[500px] relative text-ellipsis overflow-hidden max-h-24">
              {lab.lab_description}
            </p>
          </div>
        </td>
        <td>{lab.date_start}</td>
        <td>{lab.date_end}</td>
      </tr>
    );
  });

  return (
    <div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <td>Lab Name</td>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>{lab_html}</tbody>
        </table>
      </div>
    </div>
  );
};

export default LabTable;
