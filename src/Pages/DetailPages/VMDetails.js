import React from "react";
import "../../App.css";
import Navbar from "../../Components/Navbar";
import { Link, useParams } from "react-router-dom";
import { BsPower } from "react-icons/bs";
import {
  getHarvesterVMList,
  getBashHistory,
  getRunningProcesses,
  getFileMonitoring,
  getVMList,
} from "../../IronsightAPI";
import { useQuery } from "react-query";
import LinearProgress from "@mui/material/LinearProgress";
import VMCPUWidget from "../../Components/Widgets/VMStats/VMCPUWidget";
import VMMemoryWidget from "../../Components/Widgets/VMStats/VMMemoryWidget";
import VMNetworkSentWidget from "../../Components/Widgets/VMStats/VMNetworkSentWidget";
import VMNetworkReceivedWidget from "../../Components/Widgets/VMStats/VMNetworkReceivedWidget";

function VMDetails() {
  // State for selector between CPU, RAM and Network
  const [selected_graph, setSelectedGraph] = React.useState("CPU");

  // Function to power on a VM with a GET request
  const toggleVMPower = (hostname) => {
    if (localStorage.getItem("ironsight_username") === "demo_user") {
      alert("You are not authorized to manage VMs");
      return;
    }
    // Ask if the user wants to power on the VM
    var confirm_power_on = window.confirm(
      "Are you sure you want to toggle the power to " + hostname + "?"
    );
    if (confirm_power_on) {
      console.log("[Ironsight] Toggling power on : " + hostname);
      var status = fetch(
        `${process.env.REACT_APP_API_SERVER}/get.php?q=power_toggle_vm&vm_name=` + hostname
      );
      status.then((response) => {
        return response.json();
      });
    } else {
      console.log("[Ironsight] Cancelled power on VM: " + hostname);
    }
  };
  const [refetchInterval, setRefetchInterval] = React.useState(15000);
  const {
    data: harvester_data,
    isLoading: harvester_isLoading,
    isError: harvester_isError,
  } = useQuery("harvester_vms", getHarvesterVMList, {
    // Refetch the data every 15 seconds
    refetchInterval: refetchInterval,
  });

  const { vm_name } = useParams();
  var vm_status = "";
  var vm_uid = "";
  if (!harvester_isLoading && !harvester_isError) {
    for (let i = 0; i < harvester_data.length; i++) {
      if (harvester_data[i]["metadata"]["name"] === vm_name) {
        vm_status = harvester_data[i]["status"]["printableStatus"];
        vm_uid = harvester_data[i]["metadata"]["uid"];
      }
    }
  }

  var vm_vnc_address = `${process.env.REACT_APP_HARVESTER_SERVER}dashboard/c/local/harvester/console/${vm_uid}/vnc`;

  const {
    data: sql_vms,
    isLoading: sql_isLoading,
    isError: sql_isError,
  } = useQuery("virtual_machines", getVMList);

  // Function to get users
  const get_user_list = () => {
    var users_rows = [];
    if (!sql_isLoading && !sql_isError) {
      var vm_users = [];
      for (var vm in sql_vms) {
        if (sql_vms[vm].vm_name === vm_name) {
          for (var user in sql_vms[vm].users) {
            vm_users.push(sql_vms[vm].users[user]);
          }
        }
      }
      users_rows = vm_users.map((user) => {
        var link = "/user_details/" + user;
        return (
          <tr key={user} className="hover w-full">
            <td>
              <Link to={link}>{user}</Link>
            </td>
          </tr>
        );
      });
    } else {
      users_rows = <LinearProgress />;
    }
    return users_rows;
  };

  const {
    data: bash_history_data,
    isLoading: bash_isLoading,
    isError: bash_isError,
  } = useQuery(["bash_history" + vm_name, vm_name], getBashHistory, {
    // Refetch the data every 15 seconds
    refetchInterval: refetchInterval,
  });
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
            {bash_history_row["@timestamp"].split(".")[0].replace("T", " ")}
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

  // Get the VM's running processes
  const {
    data: running_processes_data,
    isLoading: running_isLoading,
    isError: running_isError,
  } = useQuery(["running_processes" + vm_name, vm_name], getRunningProcesses, {
    // Refetch the data every 15 seconds
    refetchInterval: refetchInterval,
  });
  var running_processes = [];

  // Map the process to table rows
  const get_running_processes = () => {
    if (!running_isLoading && !running_isError) {
      running_processes = running_processes_data.hits.hits;
      // Sort the processes by highest memory usage
      running_processes.sort((a, b) => {
        return b._source.memory_usage - a._source.osquery.memory_used;
      });
      var running_processes_rows = running_processes.map((running_process) => (
        <tr
          key={running_process["_source"]["osquery"]["pid"]}
          className="hover break-normal whitespace-normal"
        >
          <td>{running_process["_source"]["osquery"]["pid"]}</td>
          <td>{running_process["_source"]["osquery"]["name"]}</td>
          <td>
            {(
              parseFloat(running_process["_source"]["osquery"]["memory_used"]) /
              102.4
            )
              .toString()
              .split(".")[0] + " MB"}
          </td>
        </tr>
      ));
      if (running_processes_rows.length === 0) {
        running_processes_rows = (
          <tr>
            <td>No running processes found</td>
          </tr>
        );
      }
      return running_processes_rows;
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

  // Get the VM's files modified
  const {
    data: modified_files_data,
    isLoading: modified_isLoading,
    isError: modified_isError,
  } = useQuery(["modified_files" + vm_name, vm_name], getFileMonitoring, {
    // Refetch the data every 15 seconds
    refetchInterval: refetchInterval,
  });
  var modified_files = [];

  // Map the file modifications to table rows
  const get_modified_files = () => {
    if (!modified_isLoading && !modified_isError) {
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

  return (
    <div className="virtual_machines">
      <Navbar />

      {/* Top bar (breadcrumbs) */}
      <div className="text-md breadcrumbs m-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/virtual_machines">Virtual Machines</Link>
          </li>
          <li>
            <strong>{vm_name}</strong>
          </li>
        </ul>
      </div>

      {/* VM tags */}
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-row mx-4 md:m-4 md:mt-0 overflow-x-auto">
          Tags:
          <div className="badge badge-info gap-2 mx-1">cryptography</div>
          <div className="badge badge-success mx-1">networking</div>
          <div className="badge badge-warning mx-1">linux</div>
          <div className="badge badge-error ml-1 mr-4 break-after-all whitespace-nowrap">
            terminal practice
          </div>
        </div>
        <div className="flex flex-row mx-4 mt-2 mb-4 md:m-4 md:mt-0">
          Labs:
          <div className="badge badge-info badge-ghost gap-2 mx-1">
            <Link to="/lab_details/1">Cicada 3301 Puzzle</Link>
          </div>
          <div className="badge badge-info badge-ghost gap-2 mx-1">
            <Link to="/lab_details/3">Project Management</Link>
          </div>
        </div>
      </div>

      {/* VM details contents */}
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-4 mx-4">
        <div className="row-span-4 md:col-span-2 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6 h-full">
            {/* Performance Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
              {/* Performance Graph title */}
              <div className="col-span-1">
                <h2 className="card-title">Performance Graph</h2>
              </div>

              {/* Pagination widget */}
              <div className="tabs tabs-boxed col-span-2 justify-self-end">
                {/* When clicked, changed selected_graph between CPU, RAM, and Network */}
                <button
                  className={
                    selected_graph === "CPU" ? "tab tab-active" : "tab"
                  }
                  onClick={() => setSelectedGraph("CPU")}
                >
                  CPU
                </button>
                <button
                  className={
                    selected_graph === "RAM" ? "tab tab-active" : "tab"
                  }
                  onClick={() => setSelectedGraph("RAM")}
                >
                  RAM
                </button>
                <button
                  className={
                    selected_graph === "Network" ? "tab tab-active" : "tab"
                  }
                  onClick={() => setSelectedGraph("Network")}
                >
                  Network
                </button>
              </div>
            </div>
            {/* VMCPUWidget if selected_graph is CPU, VMRAMWidget if selected_graph is RAM */}
            {selected_graph === "CPU" ? (
              <VMCPUWidget vm_name={vm_name} />
            ) : selected_graph === "RAM" ? (
              <VMMemoryWidget vm_name={vm_name} />
            ) : selected_graph === "Network" ? (
              <div className="grid grid-cols-1 auto-rows-auto md:grid-cols-2">
                <div className="col-span-1">
                  <VMNetworkSentWidget vm_name={vm_name} />
                </div>
                <div className="col-span-1">
                  <VMNetworkReceivedWidget vm_name={vm_name} />
                </div>
              </div>
            ) : (
              <LinearProgress />
            )}
          </div>
        </div>
        <div className="col-span-1 row-span-1 rounded-box bg-base-100 shadow-xl">
          <h2 className="card-title mx-4 mt-4">Status Panel</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 grid-row-1 gap-4 m-4">
            {vm_status === "Running" ? (
              <button
                className="btn btn-success btn-outline btn-lg col-span-1 text-2xl"
                onClick={() => {
                  toggleVMPower(vm_name);
                }}
              >
                <span>
                  <BsPower />
                </span>
              </button>
            ) : vm_status === "Starting" ? (
              <button
                className="btn btn-info btn-outline btn-lg col-span-1 text-2xl"
                onClick={() => {
                  toggleVMPower(vm_name);
                }}
              >
                <span>
                  <BsPower />
                </span>
              </button>
            ) : vm_status === "Stopped" ? (
              <button
                className="btn btn-error btn-outline btn-lg col-span-1 text-2xl"
                onClick={() => {
                  toggleVMPower(vm_name);
                }}
              >
                <span>
                  <BsPower />
                </span>
              </button>
            ) : (
              <button
                className="btn btn-warning btn-outline btn-lg col-span-1 text-2xl"
                onClick={() => {
                  toggleVMPower(vm_name);
                }}
              >
                <span>
                  <BsPower />
                </span>
              </button>
            )}
            <button className="btn btn-lg btn-success btn-outline col-span-1">
              <span>Elastic Agent</span>
            </button>
            {/* When this button is clicked, visit the vm_vnc_addres */}

            <button
              className="btn btn-lg btn-success btn-outline col-span-1"
              onClick={() => {
                window.open(vm_vnc_address, "_blank");
              }}
            >
              <span>Remote VNC</span>
            </button>
            <button className="btn btn-lg btn-success btn-outline col-span-1">
              <span>SQL</span>
            </button>
          </div>
        </div>
        <div className="col-span-1 row-span-3 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6">
            <h2 className="card-title">Users</h2>
            <div className="overflow-auto mt-2 max-h-44">
              <table className="table w-full">
                <tbody className="w-full">{get_user_list()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-span-1 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6">
            <h2 className="card-title">Processes Running</h2>
            <div className="overflow-auto mt-2 max-h-44">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <td>
                      <span>PID</span>
                    </td>
                    <th>
                      <span>Name</span>
                    </th>
                    <th>
                      <span>Memory</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full">{get_running_processes()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-span-1 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6">
            <h2 className="card-title">Commands Executed</h2>
            <div className="overflow-auto mt-2 max-h-44">
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
        </div>
        <div className="col-span-1 rounded-box bg-base-100 shadow-xl">
          <div className="mx-4 my-6">
            <h2 className="card-title">Files Modified</h2>
            <div className="overflow-auto mt-2 max-h-44">
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

        {/* Right-hand side will have several cards with tables for "Commands Executed", "Files Recently Created", "Processes Running", etc.*/}
      </div>
    </div>
  );
}

export default VMDetails;
