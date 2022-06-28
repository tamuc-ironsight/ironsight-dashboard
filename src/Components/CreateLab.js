import React from "react";
import "../App.css";
import LinearProgress from "@mui/material/LinearProgress";
import { handleEvent } from "../IronsightAPI";
import { getRoles, getCourseList, getTemplateList } from "../IronsightAPI";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";

const CreateLab = () => {
  // Get roles from API

  const {
    data: role_data,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useQuery("roles", getRoles);
  const {
    data: vm_lab_create,
    isLoading: isLoadingVMLabCreate,
    isError: isErrorVMLabCreate,
  } = useQuery("vm_lab_create", getTemplateList);

  const {
    data: course_data,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useQuery("course_list", getCourseList);

  const [submitStatus, setSubmitStatus] = React.useState("");

  // States that hold the variables for the dropdown menus
  const [lab_name, setLabName] = React.useState("");
  const [lab_description, setLabDescription] = React.useState("");
  const [course_selection, setCourseSelection] = React.useState("");
  const [template_selection, setTemplateSelection] = React.useState("");

  // Function to print out JSON of selected courses and roles, firstname, lastname, etc.
  const get_lab_data = () => {
    setSubmitStatus("submitting");
    // Create a JSON object to hold the lab data
    var event_data = {
      action: "create",
      type: "lab",
      data: {
        lab_name: lab_name,
        lab_description: lab_description,
        vm_templates: [template_selection],
        course: course_selection,
        date_start: "2022-04-02 00:00:00",
        date_end: "2022-05-10 23:59:00",
        tags: [],
      },
    };

    // Remove ' and any other problematic characters from lab_description
    event_data.data.lab_description = event_data.data.lab_description.replace(
      /[^a-zA-Z0-9_\-\s]/g,
      ""
    );

    // Submit the event to the API and get the response
    handleEvent(event_data).then((response) => {
      // If the response is successful, set the submit status to success
      if (response.status === "success") {
        setSubmitStatus("success");
        // Alert the lab that the lab was created
        alert("Success");
      }
      // If the response is not successful, set the submit status to error
      else {
        setSubmitStatus(response.status);
      }
      console.log(response);
    });
  };

  const handleSubmit = () => {
    get_lab_data();
  };

  if (isLoadingRoles || isLoadingCourses || isLoadingVMLabCreate) {
    return <LinearProgress />;
  }
  if (isErrorRoles || isErrorCourses || isErrorVMLabCreate) {
    return <p>Error!</p>;
  }

  // TODO: Check if role is admin
  const role_data_dummy = role_data;
  if (role_data_dummy !== undefined) {
    // Do nothing
  }

  const vm_template = vm_lab_create.map((template) => template.template_name);

  return (
    <div className="shit">
      {/* Text box for username */}
      <div className="form-control w-full mb-6">
        <div className="grid grid-cols-2 grid-flow-row mx-4">
          {/* First name and last name row */}
          <label className="label">
            <span className="label-text mx-4">Lab Name</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row col-span-2">
            <div className="col-span-2 row-span-1 mr-2">
              <input
                type="text"
                placeholder="Lab Name"
                className="input input-bordered w-full mb-4"
                id="lab_name"
                onChange={(e) => setLabName(e.target.value)}
              />
            </div>
          </div>
          {/* Password confirmation row */}
          <label className="label">
            <span className="label-text mx-4">Description</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row col-span-2">
            <div className="col-span-2 row-span-1 mr-2">
              <textarea
                className="input input-bordered w-full mb-4"
                id="desc"
                onChange={(e) => setLabDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Selection dropdown for the roles */}
          <div className="col-span-2 row-span-1 mt-4 mb-4">
            <div
              tabIndex="0"
              className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Templates
              </div>
              <div className="collapse-content">
                {/* Map roles to checkboxes */}
                {vm_template.map((template_name) => (
                  <div key={template_name}>
                    {/* Put checkbox and role next to each other horizontally */}
                    <label className="label cursor-pointer ">
                      <input
                        type="radio"
                        name="radio-7"
                        id={`${template_name}_checkbox`}
                        className="radio checked:bg-blue-500"
                        defaultChecked={false}
                        class="radio"
                        onChange={(e) => {
                          setTemplateSelection(template_name);
                        }}
                      />
                      <span className=" ml-4 checkbox-label-text">
                        {template_name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selection dropdown for the courses */}
          <div className="col-span-2 row-span-1">
            <div
              tabIndex="0"
              className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                Course selection
              </div>
              <div className="collapse-content">
                {/* Map roles to checkboxes */}
                {course_data.map((course) => (
                  <div key={course.course_id}>
                    {/* Put checkbox and course next to each other horizontally */}
                    <label className="label cursor-pointer ">
                      <input
                        type="radio"
                        name="radio-6"
                        id={`${course.course_name}_checkbox`}
                        className="radio checked:bg-blue-500"
                        defaultChecked={false}
                        class="radio"
                        onChange={(e) => {
                          setCourseSelection(course.course_id);
                        }}
                      />
                      <span className=" ml-4 checkbox-label-text">
                        {course.course_name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {submitStatus === "submitting" ? (
          <div className="m-4">
            <CircularProgress />
          </div>
        ) : (
          <button className="btn btn-primary m-4" onClick={handleSubmit}>
            Create Lab
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateLab;
