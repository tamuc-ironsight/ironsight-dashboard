export const getVMList = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_vms`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch VMs");
  }
  return response.json();
};

export const getLabList = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_labs`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch labs");
  }
  return response.json();
};

export const getTemplateList = async () => {
  const response = await fetch( 
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_templates`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }
  return response.json();
};


export const getNewsList = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_news`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  return response.json();
};

export const getDocCount = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=%27{%22size%22:100,%22aggs%22:{%22hostnames%22:{%22terms%22:{%22field%22:%22host.name%22,%22size%22:100}}}}%27`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch doc count");
  }
  return response.json();
};

export const getCPUUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_cpu_usage&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch CPU usage");
  }
  return response.json();
};

export const getNetworkUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_network_usage&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch network usage");
  }
  return response.json();
};

export const getMemoryUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_memory_usage&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch memory usage");
  }
  return response.json();
};

export const getMetrics = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_metrics`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }
  return response.json();
};

export const getDiskUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_disk_usage&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch disk usage");
  }
  return response.json();
};

export const getVMCPUUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_vm_cpu_usage&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch VM CPU usage");
  }
  return response.json();
};

export const getVMMemoryUsage = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_vm_memory_usage&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch VM memory usage");
  }
  return response.json();
};

export const getVMNetworkPacketsReceived = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_vm_network_packets_received&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch VM network packets received");
  }
  return response.json();

};

export const getVMNetworkPacketsSent = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_vm_network_packets_sent&step=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch VM network packets sent");
  }
  return response.json();
};

export const getNumVMsOn = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_num_vms_on`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch number of VMs on");
  }
  return response.json();
};

export const getNumVMs = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_num_vms`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch number of VMs");
  }
  return response.json();
};

export const getVMsOn = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_vms_on`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch list of VMs on");
  }
  return response.json();
};

export const getLabOverview = async ({ queryKey }) => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_lab_overview&lab_num=${queryKey[1]}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch lab overview data for ");
  }
  return response.json();
};

export const getCourseList = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_courses`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch class list");
  }
  return response.json();
};

export const getTags = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_tags`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};

export const getUsersList = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_users`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user list");
  }
  return response.json();
};

export const getRoles = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_roles`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }
  return response.json();
};

export const getPermissions = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_permissions`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch permissions");
  }
  return response.json();
};

export const getHarvesterVMList = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=get_harvester_vms`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch harvester VM list");
  }
  return response.json();
};

export const getActivityLog = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}log_data.php`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activity log");
  }
  return response.json();
};

export const getBashHistory = async ({queryKey}) => {
  // End_time is in this format: 2022-01-15T12:37:25.294Z
  // Start time is 15 minutes ago
  const start_time = Date.now() - 15 * 60 * 1000;
  const end_time = Date.now();
  // Convert to ISO 8601 (Zulu time)
  const start_time_iso = new Date(start_time).toISOString();
  const end_time_iso = new Date(end_time).toISOString();
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q='{"size": 500,"query": {"bool": {"must": [],"filter": [{"bool": {"should": [{"match_phrase": {"agent.name": "${queryKey[1]}"}}],"minimum_should_match": 1}},{"range": {"@timestamp": {"format": "strict_date_optional_time","gte": "${start_time_iso}","lte": "${end_time_iso}"}}},{"match_phrase": {"action_id": "pack_Ironsight_Pack_bash_history"}}]}}}'&i=.ds-logs-osquery_manager.result-default-2022.05.02-000002`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch bash history");
  }
  return response.json();
};

export const getRunningProcesses = async ({queryKey}) => {
  // End_time is in this format: 2022-01-15T12:37:25.294Z
  // Start time is 15 minutes ago
  const start_time = Date.now() - 15 * 60 * 1000;
  const end_time = Date.now();
  // Convert to ISO 8601 (Zulu time)
  const start_time_iso = new Date(start_time).toISOString();
  const end_time_iso = new Date(end_time).toISOString();
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q='{"size": 500,"query": {"bool": {"must": [],"filter": [{"bool": {"should": [{"match_phrase": {"agent.name": "${queryKey[1]}"}}],"minimum_should_match": 1}},{"range": {"@timestamp": {"format": "strict_date_optional_time","gte": "${start_time_iso}","lte": "${end_time_iso}"}}},{"match_phrase": {"action_id": "pack_Ironsight_Pack_Processes"}}],"should": [],"must_not": []}}}'&i=.ds-logs-osquery_manager.result-default-2022.05.02-000002`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch running processes");
  }
  return response.json();
};

export const getFileMonitoring = async ({queryKey}) => {
  // End_time is in this format: 2022-01-15T12:37:25.294Z
  // Start time is 15 minutes ago
  const start_time = Date.now() - 15 * 60 * 1000;
  const end_time = Date.now();
  // Convert to ISO 8601 (Zulu time)
  const start_time_iso = new Date(start_time).toISOString();
  const end_time_iso = new Date(end_time).toISOString();
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q='{"size": 500,"query": {"bool": {"must": [],"filter": [{"bool": {"should": [{"match_phrase": {"agent.name": "${queryKey[1]}"}}],"minimum_should_match": 1}},{"range": {"@timestamp": {"format": "strict_date_optional_time","gte": "${start_time_iso}","lte": "${end_time_iso}"}}},{"match_phrase": {"action_id": "pack_Ironsight_Pack_file_monitoring"}}],"should": [],"must_not": []}}}'&i=.ds-logs-osquery_manager.result-default-2022.05.02-000002`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch file monitoring");
  }
  return response.json();
};

export const handleEvent = async (event_data) => {
  console.log("Event data: ", event_data);
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}event_handler.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event_data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to handle event");
  }
  return response.json();
};

export const postActivityLog = (username, activity) => {
  return fetch(`${import.meta.env.VITE_IRONSIGHT_API_URL}log_data.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Timestamp in YYYY-MM-DD HH:MM:SS format
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      username: username,
      activity: activity,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to post activity log");
    }
    console.log(response.json());
    return response.json();
  });
};

export const powerOnVM = async ({ queryKey }) => {
  if (queryKey[1] === "") {
    return { error: "No VM specified" };
  }
  const response = await fetch(
    `${import.meta.env.VITE_IRONSIGHT_API_URL}get.php?q=power_on_vm&vm_name=${queryKey[1]}`
  );
  if (!response.ok) {
    throw new Error("Failed to power on VM " + queryKey[1]);
  }
  return response.json();
};

export const authenticate = (username, password) => {
  console.log("Authenticating...");
  try {
    return fetch(`${import.meta.env.VITE_IRONSIGHT_API_URL}authenticate.php`, {
      method: "POST",
      headers: {},
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((status) => {
        return status.status;
      });
  } catch (error) {
    console.log(error);
    alert(error);
  }
};
