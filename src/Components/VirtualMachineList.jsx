import React from "react";
import { useQuery } from "react-query";
import { getVMList, getHypervisorVMList, getLabList } from "../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";
import CreateVMButton from "./CreateVMButton";
import { BsPower } from "react-icons/bs";
import { Link } from "react-router-dom";

export const VirtualMachineList = () => {
  const [intervalMs, setIntervalMs] = React.useState(5000);
  const { data, isLoading, isError } = useQuery("virtual_machines", getVMList);
  const {
    data: hypervisor_data,
    isLoading: hypervisor_isLoading,
    isError: hypervisor_isError,
  } = useQuery("hypervisor_vms", getHypervisorVMList, {
    refetchInterval: intervalMs,
  });

  const {
    data: lab_data,
    isLoading: lab_isLoading,
    isError: lab_isError,
  } = useQuery("labs", getLabList, {
    refetchInterval: intervalMs,
  });

  if (isLoading || hypervisor_isLoading || lab_isLoading) {
    return <LinearProgress />;
  }

  if (isError || hypervisor_isError || lab_isError) {
    return <p>Error!</p>;
  }

  const get_labs_list = () => {
    // Find lab by lab num and store in lab_mapping
    var lab_mapping = {};
    for (let i = 0; i < lab_data.length; i++) {
      lab_mapping[lab_data[i].lab_num] = lab_data[i].lab_name;
    }
    return lab_mapping;
  };
  const lab_mapping = get_labs_list();

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
        `${import.meta.env.VITE_HYPERVISOR_URL}/vms/` + hostname + `/toggle_power`,
        {
          method: "POST"
        }
      );
      status.then((response) => {
        return response.json();
      });
    } else {
      console.log("[Ironsight] Cancelled power on VM: " + hostname);
    }
  };

  // Loop through hypervisor VM list and if there is a VM in the get_vm_list, add the port number to the list
  for (var i = 0; i < hypervisor_data['data'].length; i++) {
    var hypervisor_vm = hypervisor_data['data'][i];
    var hypervisor_vm_name = hypervisor_vm.name;
    for (var j = 0; j < data.length; j++) {
      if (hypervisor_vm_name === data[j].vm_name) {
        hypervisor_data['data'][i].port_number = data[j].port_number;
        hypervisor_data['data'][i].users = data[j].users;
        hypervisor_data['data'][i].labs = data[j].labs;
      }
    }
  }

  // Convert the labs in the hypervisor_data to the lab_mapping alias
  for (var i = 0; i < hypervisor_data['data'].length; i++) {
    var hypervisor_vm = hypervisor_data['data'][i];
    if (hypervisor_data['data'].labs) {
      var hypervisor_vm_labs = hypervisor_data['data'].labs;
      var hypervisor_vm_labs_list = [];
      for (var j = 0; j < hypervisor_vm_labs.length; j++) {
        hypervisor_vm_labs_list[j] = lab_mapping[hypervisor_vm_labs[j]];
      }
      hypervisor_data['data'][i].labs = hypervisor_vm_labs_list;
    }
  }

  // Sort hypervisor_data by name
  hypervisor_data['data'] = hypervisor_data['data'].sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  }
  );

  const get_hypervisor_vm_list = () => {
    return hypervisor_data['data'].map(
      ({ name, status, port_number, users, labs }) => (
        <tr key={name} className="hover">
          <td>
            <Link key={name} to={"/vm_details/" + name}>
              {name}
            </Link>
          </td>
          <td>
            {
              // If users is undefined or an empty list, display ---. Otherwise, display the users list
              labs === undefined || labs.length === 0 ? "---" : labs.join(", ")
            }
          </td>
          <td>
            {
              // If users is undefined or an empty list, display ---. Otherwise, display the users list where each user name goes to user_details page
              users === undefined || users.length === 0
                ? "---"
                : users.map((user) => (
                    <Link
                      key={user}
                      to={"/user_details/" + user}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {/* Separate with commas */}
                      {user}
                      {users.length - 1 === users.indexOf(user) ? "" : ", "}
                    </Link>
                  ))
            }
          </td>
          <td>{port_number ? port_number : "---"}</td>
          <td>
            {/* Three states are Running, Starting, and Stopped */}

            {status === "running" ? (
              <div className="badge badge-success gap-2">
                {status}
              </div>
            ) : status === "starting" ? (
              <div className="badge badge-info gap-2">
                {status}
              </div>
            ) : status === "stopped" ? (
              <div className="badge badge-error gap-2">
                {status}
              </div>
            ) : (
              <div className="badge badge-warning gap-2">
                {status}
              </div>
            )}
          </td>
          {/* Power button */}
          <td>
            <button
              onClick={() => {
                toggleVMPower(name);
              }}
              className="btn btn-outline btn-sm btn-circle"
              type="button"
            >
              <BsPower />
            </button>
          </td>
        </tr>
      )
    );
  };
  // Get the hypervisor_vm_list and sort by name
  const hypervisor_vm_list = get_hypervisor_vm_list();

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-end m-4 xl:mr-48">
        <CreateVMButton />
      </div>
      <div className="overflow-auto m-4 xl:mx-48">
        <table className="table w-full">
          <thead>
            <tr>
              <td>Name</td>
              <th>Labs</th>
              <th>Users</th>
              <th>Port</th>
              <th>Status</th>
              <th>Power</th>
            </tr>
          </thead>
          <tbody>{hypervisor_vm_list}</tbody>
        </table>
      </div>
    </div>
  );
};

export default VirtualMachineList;
