import React from "react";
import { useQuery } from "react-query";
import { getVMList, getHarvesterVMList, getLabList } from "../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";
import CreateVMButton from "./CreateVMButton";
import { BsPower } from "react-icons/bs";
import { Link } from "react-router-dom";

export const VirtualMachineList = () => {
  const [intervalMs, setIntervalMs] = React.useState(5000);
  const { data, isLoading, isError } = useQuery("virtual_machines", getVMList);
  const {
    data: harvester_data,
    isLoading: harvester_isLoading,
    isError: harvester_isError,
  } = useQuery("harvester_vms", getHarvesterVMList, {
    refetchInterval: intervalMs,
  });

  const {
    data: lab_data,
    isLoading: lab_isLoading,
    isError: lab_isError,
  } = useQuery("labs", getLabList, {
    refetchInterval: intervalMs,
  });

  if (isLoading || harvester_isLoading || lab_isLoading) {
    return <LinearProgress />;
  }

  if (isError || harvester_isError || lab_isError) {
    return <p>Error!</p>;
  }

  const get_vm_list = () => {
    return data.map(({ vm_name, template_name, port_number }) => (
      <tr key={vm_name} className="hover">
        <td>{vm_name}</td>
        <td>{template_name}</td>
        <td>{port_number}</td>
      </tr>
    ));
  };
  const vm_list = get_vm_list();

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
        `${process.env.REACT_APP_IRONSIGHT_API_URL}/get.php?q=power_toggle_vm&vm_name=` + hostname
      );
      status.then((response) => {
        return response.json();
      });
    } else {
      console.log("[Ironsight] Cancelled power on VM: " + hostname);
    }
  };

  // Loop through Harvester VM list and if there is a VM in the get_vm_list, add the port number to the list
  for (var i = 0; i < harvester_data.length; i++) {
    var harvester_vm = harvester_data[i];
    var harvester_vm_name = harvester_vm.metadata.name;
    for (var j = 0; j < data.length; j++) {
      if (harvester_vm_name === data[j].vm_name) {
        harvester_data[i].port_number = data[j].port_number;
        harvester_data[i].users = data[j].users;
        harvester_data[i].labs = data[j].labs;
      }
    }
  }

  // Convert the labs in the harvester_data to the lab_mapping alias
  for (var i = 0; i < harvester_data.length; i++) {
    var harvester_vm = harvester_data[i];
    if (harvester_vm.labs) {
      var harvester_vm_labs = harvester_vm.labs;
      var harvester_vm_labs_list = [];
      for (var j = 0; j < harvester_vm_labs.length; j++) {
        harvester_vm_labs_list[j] = lab_mapping[harvester_vm_labs[j]];
      }
      harvester_data[i].labs = harvester_vm_labs_list;
    }
  }

  const get_harvester_vm_list = () => {
    return harvester_data.map(
      ({ metadata, status, port_number, users, labs }) => (
        <tr key={metadata.name} className="hover">
          <td>
            <Link key={metadata.name} to={"/vm_details/" + metadata.name}>
              {metadata.name}
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

            {status.printableStatus === "Running" ? (
              <div className="badge badge-success gap-2">
                {status.printableStatus}
              </div>
            ) : status.printableStatus === "Starting" ? (
              <div className="badge badge-info gap-2">
                {status.printableStatus}
              </div>
            ) : status.printableStatus === "Stopped" ? (
              <div className="badge badge-error gap-2">
                {status.printableStatus}
              </div>
            ) : (
              <div className="badge badge-warning gap-2">
                {status.printableStatus}
              </div>
            )}
          </td>
          {/* Power button */}
          <td>
            <button
              onClick={() => {
                toggleVMPower(metadata.name);
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
  const harvester_vm_list = get_harvester_vm_list();

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
          <tbody>{harvester_vm_list}</tbody>
        </table>
      </div>
    </div>
  );
};

export default VirtualMachineList;
