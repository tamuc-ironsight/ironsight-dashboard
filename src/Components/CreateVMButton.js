import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { handleEvent } from "../IronsightAPI";
import CircularProgress from "@mui/material/CircularProgress";

export default function CreateVMDialog() {
  const [open, setOpen] = React.useState(false);
  const [template_selection, setTemplateSelection] = React.useState("");
  const [template_list, setTemplateList] = React.useState([]);
  const [lab_list, setLabList] = React.useState([]);
  const [lab_selection, setLabSelection] = React.useState("");
  const [course_list, setCourseList] = React.useState([]);
  const [course_selection, setCourseSelection] = React.useState("");
  const [vm_name, setVmName] = React.useState("");
  const [user_list, setUserList] = React.useState([]);
  const [user_selection, setUserSelection] = React.useState("");
  const [is_elastic, setIsElastic] = React.useState(false);
  const [is_customize_open, setIsCustomizeOpen] = React.useState(false);
  const [cpu_cores, setCpuCores] = React.useState(2);
  const [memory, setMemory] = React.useState(4);
  const [redeploy, setRedeploy] = React.useState(false);
  const [is_running, setIsRunning] = React.useState(true);

  const handleClickOpen = () => {
    if (localStorage.getItem("ironsight_username") === "demo_user") {
      alert("You are not authorized to manage VMs");
      return;
    } else {
      setVmName("");
      setOpen(true);
    }
  };

  const handleClose = () => {
    // console.log(vm_name);
    setOpen(false);
  };

  const change_template = (event) => {
    setTemplateSelection(event.target.value);
    setIsElastic(Boolean(event.target.value.elastic_enrolled));
    // console.log(is_elastic);
  };

  const change_user = (event) => {
    setUserSelection(event.target.value);
    // console.log(event.target.value);
  };

  const set_vm_name = (event) => {
    {
      /* Name field can only be alphanumeric and dashes, fail otherwise */
    }
    var vm_name_input = event.target.value;
    // Replace all non-alphanumeric characters with dashes (allow dashes in the middle)
    vm_name_input = vm_name_input.replace(/[^a-zA-Z0-9-]/g, "-");
    // Replace all dashes with one dash
    vm_name_input = vm_name_input.replace(/-+/g, "-");
    // Make it lowercase
    vm_name_input = vm_name_input.toLowerCase();
    setVmName(vm_name_input);
  };

  const set_is_elastic = (event) => {
    setIsElastic(event.target.checked);
    // console.log(event.target.checked);
  };

  const toggle_customize = () => {
    setIsCustomizeOpen(!is_customize_open);
  };

  const set_lab_selection = (event) => {
    console.log(event);
    setLabSelection(event.target.value);
    var template_name = event.target.value.templates[0];
    // Find the template name in the template list
    for (var i = 0; i < template_list.length; i++) {
      if (template_list[i].key === template_name) {
        setTemplateSelection(template_list[i].props.value);
        break;
      }
    }
    setIsElastic(Boolean(template_list[i].props.value.elastic_enrolled));
  };

  // Make a GET request to the server to get the list of templates
  // and map them to a dropdown menu
  const get_templates = () => {
    fetch(`${process.env.REACT_APP_IRONSIGHT_API_URL}/get.php?q=get_templates`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        var template_list = data.map(function (template) {
          return (
            <MenuItem key={template.template_name} value={template}>
              {template.template_name}
            </MenuItem>
          );
        });
        setTemplateList(template_list);
      });
  };

  // Make a GET request to the server to get the list of users
  // and map them to a dropdown menu
  const get_users = () => {
    fetch(`${process.env.REACT_APP_IRONSIGHT_API_URL}/get.php?q=get_users`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        var user_list = data.map(function (user) {
          return (
            <MenuItem key={user.user_name} value={user.user_name}>
              {user.user_name}
            </MenuItem>
          );
        });
        setUserList(user_list);
      });
  };

  // Make a GET request to the server to get the list of templates
  // and map them to a dropdown menu
  const get_labs = () => {
    fetch(`${process.env.REACT_APP_IRONSIGHT_API_URL}/get.php?q=get_labs`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        var lab_list = data.map(function (lab) {
          return (
            <MenuItem key={lab.lab_name} value={lab}>
              {lab.lab_name}
            </MenuItem>
          );
        });
        setLabList(lab_list);
      });
  };

  // Make a GET request to the server to get the list of templates
  // and map them to a dropdown menu
  const get_courses = () => {
    fetch(`${process.env.REACT_APP_IRONSIGHT_API_URL}/get.php?q=get_courses`)
      .then((response) => response.json())
      .then((data) => {
        var course_list = data.map(function (class_obj) {
          return (
            <MenuItem key={class_obj.course_id} value={class_obj.course_id}>
              {class_obj.course_name}
            </MenuItem>
          );
        });
        setCourseList(course_list);
      });
  };

  // Get the list of templates on page load, and set the state
  React.useEffect(() => {
    get_templates();
    get_users();
    get_labs();
    get_courses();
  }, []);

  const [submitStatus, setSubmitStatus] = React.useState("");

  // Filter labs based on the course selection
  var filtered_labs = [];
  const filter_labs = () => {
    for (var i = 0; i < lab_list.length; i++) {
      if (lab_list[i].props.value.course_id === course_selection) {
        filtered_labs.push(lab_list[i].props.value);
      }
    }
  };
  filter_labs();

  // Map labs to HTML
  const lab_list_html = filtered_labs.map((lab) => {
    return (
      <MenuItem key={lab.lab_name} value={lab}>
        {lab.lab_name}
      </MenuItem>
    );
  });

  // Make a POST request to the server to create a new VM
  // Function to print out JSON of selected courses and roles, firstname, lastname, etc.
  const get_vm_data = () => {
    setSubmitStatus("submitting");
    // Create a JSON object to hold the course data
    var event_data = {
      action: "create",
      type: "vm",
      data: {
        vm_name: vm_name,
        user_name: user_selection,
        template_name: template_selection.template_name,
        course_id: course_selection,
        lab_num: lab_selection.lab_num,
        template_override: {
          elastic_enrolled: is_elastic,
          cpu_cores: cpu_cores,
          memory: memory,
          redeploy: redeploy,
          running: is_running,
        },
      },
    };
    console.log(event_data);

    // Submit the event to the API and get the response
    handleEvent(event_data).then((response) => {
      // If the response is successful, set the submit status to success
      if (response.status === "success") {
        setSubmitStatus("success");
        // Alert the course that the course was created
        alert("Success");
        handleClose();
      }
      // If the response is not successful, set the submit status to error
      else {
        setSubmitStatus(response.status);
      }
      console.log(response);
    });
  };

  const handleSubmit = () => {
    get_vm_data();
  };

  return (
    <div>
      <Tooltip
        title="Create a new virtual machine in Harvester"
        placement="top"
      >
        <Button
          variant="contained"
          color="success"
          style={{ width: "100px" }}
          onClick={() => {
            // Set the state of the dialog to open
            handleClickOpen();
          }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Virtual Machine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a virtual machine, please enter the name, select a
            template, a user name, and click "Create".
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="VM Name"
            type="text"
            fullWidth
            variant="filled"
            autoComplete="off"
            InputLabelProps={{ required: true }}
            value={vm_name}
            // On change, set the value of the vm_name variable
            onChange={set_vm_name}
          />
          <FormControl sx={{ m: 2, minWidth: "94%" }}>
            <InputLabel htmlFor="course">Course</InputLabel>
            <Select
              value={course_selection}
              onChange={(event) => {
                setCourseSelection(event.target.value);
              }}
              label="Course"
              inputProps={{
                name: "course",
                id: "course",
              }}
            >
              {course_list}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 2, minWidth: "46%" }}>
            <InputLabel htmlFor="lab">Lab</InputLabel>
            <Select
              value={lab_selection}
              onChange={(event) => {
                set_lab_selection(event);
              }}
              label="Lab"
              inputProps={{
                name: "lab",
                id: "lab",
              }}
            >
              {lab_list_html}
            </Select>
          </FormControl>

          <FormControl sx={{ mt: 2, minWidth: "46%" }}>
            <InputLabel htmlFor="user">User</InputLabel>
            <Select
              value={user_selection}
              onChange={change_user}
              label="user"
              inputProps={{
                name: "user",
                id: "user",
              }}
            >
              {user_list}
            </Select>
          </FormControl>

          {/* Customize button with dropdown for more specs (CPU Cores, RAM, etc.) */}
          <Button
            color="primary"
            variant="outline"
            startIcon={<EditIcon />}
            onClick={toggle_customize}
          >
            Customize
          </Button>

          <Tooltip title="Elastic Agent logs data into the Elasticsearch database for future machine learning usage">
            <FormControlLabel
              control={
                <Switch
                  checked={is_elastic}
                  onChange={set_is_elastic}
                  name="is_elastic"
                  color="primary"
                />
              }
              label="Install Elastic Agent"
            />
          </Tooltip>
          {/* If customize toggle is true, open submenu to customize CPU cores and memory */}
          {is_customize_open ? (
            <div>
              <FormControl sx={{ m: 2, minWidth: "94%" }}>
                <InputLabel htmlFor="template">Template</InputLabel>
                <Select
                  value={template_selection}
                  onChange={(event) => {
                    change_template(event);
                  }}
                  label="Template"
                  inputProps={{
                    name: "template",
                    id: "template",
                  }}
                >
                  {template_list}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 2, minWidth: "46%" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="CPU Cores"
                  type="number"
                  fullWidth
                  autoComplete="off"
                  defaultValue={2}
                  onChange={(event) => {
                    setCpuCores(event.target.value);
                  }}
                  InputLabelProps={{ required: false }}
                />
              </FormControl>
              <FormControl sx={{ mt: 2, minWidth: "46%" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Memory (GB)"
                  type="number"
                  fullWidth
                  autoComplete="off"
                  defaultValue={4}
                  onChange={(event) => {
                    setMemory(event.target.value);
                  }}
                  InputLabelProps={{ required: false }}
                />
              </FormControl>
              <FormControl sx={{ ml: 2, minWidth: "46%" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={redeploy}
                      onChange={(event) => {
                        setRedeploy(event.target.checked);
                      }}
                      name="redeploy"
                      color="primary"
                    />
                  }
                  label="Redeploy"
                />
              </FormControl>
              <FormControl sx={{ ml: 2, minWidth: "46%" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={is_running}
                      onChange={(event) => {
                        setIsRunning(event.target.checked);
                      }}
                      name="running"
                      color="primary"
                    />
                  }
                  label="Running"
                />
              </FormControl>
            </div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {submitStatus === "submitting" ? (
            <div className="m-4">
              <CircularProgress />
            </div>
          ) : (
            <Button onClick={handleSubmit}>Create</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
