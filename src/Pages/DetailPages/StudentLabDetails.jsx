import React from "react";
import "../../App.css";
import Navbar from "../../Components/Navbar";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import {
  getCourseList,
  getVMList,
  getLabList,
  getUsersList,
  getHarvesterVMList,
  getBashHistory,
  getFileMonitoring,
} from "../../IronsightAPI";

function StudentLabDetails() {
  const { lab_num, student_name } = useParams();

  // Get course associated with this lab_num
  const {
    data: course_data,
    isLoading: isLoading_course,
    isError: isError_course,
  } = useQuery("course_list", getCourseList);
  const {
    data: lab_data,
    isLoading: isLoading_lab,
    isError: isError_lab,
  } = useQuery("lab_list", getLabList);
  const {
    data: vm_data,
    isLoading: isLoading_vm,
    isError: isError_vm,
  } = useQuery("vm_list", getVMList);
  const {
    data: user_data,
    isLoading: isLoading_user,
    isError: isError_user,
  } = useQuery("users_list", getUsersList);
  const {
    data: harvester_data,
    isLoading: harvester_isLoading,
    isError: harvester_isError,
  } = useQuery("harvester_vms", getHarvesterVMList);
  var [selectedVM, setSelectedVM] = React.useState("");
  const {
    data: bash_history_data,
    isLoading: bash_isLoading,
    isError: bash_isError,
  } = useQuery(["bash_history" + selectedVM, selectedVM], getBashHistory);
  // Get the VM's files modified
  const {
    data: modified_files_data,
    isLoading: modified_isLoading,
    isError: modified_isError,
  } = useQuery(["modified_files" + selectedVM, selectedVM], getFileMonitoring);

  if (
    isLoading_course ||
    isLoading_lab ||
    isLoading_vm ||
    isLoading_user ||
    harvester_isLoading
  ) {
    return <LinearProgress />;
  }
  if (
    isError_course ||
    isError_lab ||
    isError_vm ||
    isError_user ||
    harvester_isError
  ) {
    return <p>Error!</p>;
  }

  // Get course_id out of lab_data
  var course_id = "";
  for (let i = 0; i < lab_data.length; i++) {
    if (lab_data[i].lab_num.toString() === lab_num) {
      course_id = lab_data[i].course_id;
    }
  }

  // Find course_name out of course_data using course_id
  var course_name = "";
  for (let i = 0; i < course_data.length; i++) {
    if (course_data[i].course_id === course_id) {
      course_name = course_data[i].course_name;
    }
  }

  // Get student data out of user_data
  var student_data = [];
  for (let i = 0; i < user_data.length; i++) {
    if (user_data[i].user_name === student_name) {
      student_data = user_data[i];
    }
  }

  // Capitalize the first letter of the first name and last name
  var first_name =
    student_data.first_name.charAt(0).toUpperCase() +
    student_data.first_name.slice(1);
  var last_name =
    student_data.last_name.charAt(0).toUpperCase() +
    student_data.last_name.slice(1);

  // Get the lab name out of lab_data
  var lab_name = "";
  for (let i = 0; i < lab_data.length; i++) {
    if (lab_data[i].lab_num.toString() === lab_num) {
      lab_name = lab_data[i].lab_name;
    }
  }

  function getLabRequirements() {
    var lab_requirements = [];
    for (let i = 0; i < 10; i++) {
      lab_requirements[i] = (
        <div className="form-control flex flex-row gap-4 items-center">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={i < 5 ? true : false}
              className="checkbox checkbox-primary"
            />
            {/* Item 1 justify next to checkbox */}
          </label>
          <span className="checkbox-label">Item {i + 1}</span>
        </div>
      );
    }
    return lab_requirements;
  }

  function getStudentVirtualMachines() {
    var lab_vms = [];
    for (let i = 0; i < vm_data.length; i++) {
      for (let j = 0; j < vm_data[i].labs.length; j++) {
        if (vm_data[i].labs[j].toString() === lab_num) {
          lab_vms.push(vm_data[i]);
        }
      }
    }
    var student_vms = [];
    for (let i = 0; i < lab_vms.length; i++) {
      for (let j = 0; j < lab_vms[i].users.length; j++) {
        if (lab_vms[i].users[j].toString() === student_name) {
          student_vms.push(lab_vms[i]);
        }
      }
    }
    return student_vms;
  }

  function getVirtualMachineTabs() {
    var student_vms = getStudentVirtualMachines();
    var vm_tabs = [];
    for (let i = 0; i < student_vms.length; i++) {
      vm_tabs.push(
        <button
          className={
            selectedVM === student_vms[i].vm_name ? "btn btn-primary" : "btn"
          }
          onClick={() => setSelectedVM(student_vms[i].vm_name)}
        >
          {student_vms[i].vm_name}
        </button>
      );
    }

    return <div className="btn-group">{vm_tabs}</div>;
  }

  if (getStudentVirtualMachines().length != 0 && selectedVM == "") {
    selectedVM = getStudentVirtualMachines()[0].vm_name;
  }

  var bash_history = [];
  if (!bash_isLoading && !bash_isError) {
    // Extract bash_history_data.hits.hits[0]._source.osquery
    for (let i = 0; i < bash_history_data.hits.hits.length; i++) {
      bash_history.push(bash_history_data.hits.hits[i]._source);
    }
  }

  // Map the timestamp, osquery command, and osquery username to table rows
  const get_bash_history = () => {
    if (!bash_isLoading && !bash_isError) {
      // Reverse bash_history so that the most recent is at the top
      bash_history.reverse();
      var bash_history_rows = bash_history.map((bash_history_row) => (
        <tr
          key={bash_history_row["@timestamp"]}
          className="hover break-normal whitespace-normal"
        >
          {/* Need to remove everything after the dot in the timestamp */}
          <td>
            {/* Chop off the last 3 characters */}
            {bash_history_row["@timestamp"]
              .split(".")[0]
              .replace("T", " ")
              .slice(0, -3)
              .slice(2)}
          </td>
          <td>{bash_history_row["osquery"]["command"]}</td>
          <td>{bash_history_row["osquery"]["username"]}</td>
        </tr>
      ));
      if (bash_history_rows.length === 0) {
        bash_history_rows = (
          <tr>
            <td>No bash history found</td>
          </tr>
        );
      }
      return bash_history_rows;
    } else {
      return (
        <tr>
          <td>
            <LinearProgress />
          </td>
        </tr>
      );
    }
  };

  var modified_files = [];
  // Map the file modifications to table rows
  const get_modified_files = () => {
    if (!modified_isLoading && !modified_isError) {
      console.log(modified_files_data);
      modified_files = modified_files_data.hits.hits;
      var modified_files_rows = modified_files.map((modified_file) => (
        <tr key={modified_file["_source"]["osquery"]["path"]} className="hover">
          <td className="break-normal whitespace-normal">
            {modified_file["_source"]["osquery"]["path"]}
          </td>
          <td>{modified_file["_source"]["osquery"]["owner"]}</td>
          <td>{modified_file["_source"]["osquery"]["last_mod"]}</td>
          <td>
            {modified_file["_source"]["osquery"]["size_mb"]
              .toString()
              .split(".")[0] + " MB"}
          </td>
          <td>{modified_file["_source"]["osquery"]["created"]}</td>
        </tr>
      ));
      if (modified_files_rows.length === 0) {
        modified_files_rows = (
          <tr>
            <td>No modified files found</td>
          </tr>
        );
      }
      return modified_files_rows;
    } else {
      return (
        <tr>
          <td>
            <LinearProgress />
          </td>
        </tr>
      );
    }
  };

  function remoteVNC(vm_name) {
    // TODO: Implement
  }

  return (
    <div className="labs">
      <Navbar />
      <div className="text-md breadcrumbs m-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to={`/course_details/${course_id}/`}>{course_name}</Link>
          </li>
          <li>
            <Link to={`/lab_details/${lab_num}/`}>{lab_name}</Link>
          </li>
          <li>
            <strong>
              {first_name} {last_name}
            </strong>
          </li>
        </ul>
      </div>

      {/* Display VMs that are in this lab, lab requirements with checkboxes, 
          combined bash history for each virtual machine in lab, login history,
          whether or not the lab has been submitted, and notes*/}

      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-4 mx-4">
        <div className="row-span-4 md:col-span-2 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6 h-full">
            {/* Main Panel */}
            <div className="grid grid-cols-1 mb-4">
              {/* Main panel title */}
              <div className="col-span-1 flex flex-col">
                <div className="flex flex-row gap-4">
                  <h2 className="card-title">Virtual Machines</h2>
                  {getVirtualMachineTabs()}
                  <button
                    className="btn btn-success btn-outline"
                    onClick={() => {
                      remoteVNC("filler");
                    }}
                  >
                    <span>Remote VNC</span>
                  </button>
                </div>
                <div></div>
              </div>
              {/* Main panel body */}
              <div className="col-span-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="mx-4 my-6">
                    <h2 className="card-title">Commands Executed</h2>
                    <div className="overflow-auto mt-2 max-h-96">
                      <table className="table table-compact w-full">
                        <thead>
                          <tr>
                            <td>
                              <span>Timestamp</span>
                            </td>
                            <th>
                              <span>Command</span>
                            </th>
                            <th>
                              <span>User</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="w-full">{get_bash_history()}</tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mx-4 my-6">
                    <h2 className="card-title">Files Modified</h2>
                    <div className="overflow-auto mt-2 max-h-96">
                      <table className="overflow-auto table table-compact w-full">
                        <thead>
                          <tr>
                            <td>Path</td>
                            <th>
                              <span>Owner</span>
                            </th>
                            <th>
                              <span>Last Modified</span>
                            </th>
                            <th>
                              <span>Size</span>
                            </th>
                            <th>
                              <span>Created</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="w-full">{get_modified_files()}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-4 md:col-span-1 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6 h-full">
            {/* Lab Requirements */}
            <div className="grid grid-cols-1 mb-4">
              {/* Lab Requirements title */}
              <div className="col-span-1">
                <h2 className="card-title mb-4">Lab Requirements</h2>
                {/* Checkboxes for action items */}
                {/* Make 8 of them as a placeholder */}
                {getLabRequirements()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLabDetails;
