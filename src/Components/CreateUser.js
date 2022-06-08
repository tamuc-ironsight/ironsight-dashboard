import React from "react";
import "../App.css";
import LinearProgress from "@mui/material/LinearProgress";
import { getRoles, getCourseList } from "../IronsightAPI";
import { useQuery } from "react-query";
import { handleEvent } from "../IronsightAPI";
import CircularProgress from "@mui/material/CircularProgress";

const CreateUser = () => {
  // Get roles from API

  const {
    data: role_data,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useQuery("roles", getRoles);

  const {
    data: course_data,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useQuery("course_list", getCourseList);

  // States that hold the variables for the dropdown menus and name/pass
  const [first_name, setFirstName] = React.useState("");
  const [last_name, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm_password, setConfirmPassword] = React.useState("");
  const [roles, setRoles] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [profile_pic_data, setProfilePicData] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [submitStatus, setSubmitStatus] = React.useState("");

  if (isLoadingRoles || isLoadingCourses) {
    return <LinearProgress />;
  }
  if (isErrorRoles || isErrorCourses) {
    return <p>Error!</p>;
  }

  function set_first_name(value) {
    // Make sure the value has only letters or is empty
    if (value.match(/^[a-zA-Z]+$/) || value === "") {
      setFirstName(value);
    }
  }

  function set_last_name(value) {
    // Make sure the value has only letters or is empty
    if (value.match(/^[a-zA-Z]+$/) || value === "") {
      setLastName(value);
    }
  }

  function set_password(value) {
    // Make sure the value has no spaces or is empty
    if (value.match(/^\S+$/) || value === "") {
      setPassword(value);
    }
  }

  function set_confirm_password(value) {
    // Make sure the value has no spaces or is empty
    if (value.match(/^\S+$/) || value === "") {
      setConfirmPassword(value);
    }
  }

  // Take role_data and just make an array of the role names
  const role_names = role_data.map((role) => role.role);

  // Function to print out JSON of selected courses and roles, firstname, lastname, etc.
  const get_user_data = () => {
    // Check to see if first name or last name is empty
    if (first_name === "" || last_name === "") {
      alert("Please enter a first and last name");
      return;
    }

    // Check if password is blank
    if (password === "") {
      alert("Passwords cannot be empty!");
      return;
    }
    // Check password and confirm password match
    if (password !== confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    setSubmitStatus("submitting");
    // Create a JSON object to hold the user data
    var event_data = {
      action: "create",
      type: "user",
      data: {
        courses: courses,
        roles: roles,
        first_name: first_name,
        last_name: last_name,
        user_name: (first_name + "_" + last_name).toLowerCase(),
        password: password,
        profile_pic_data: profile_pic_data,
        tags: tags,
      },
    };
    // Submit the event to the API and get the response
    handleEvent(event_data).then((response) => {
      // If the response is successful, set the submit status to success
      if (response.status === "success") {
        setSubmitStatus("success");

        // Clear the form
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
        setRoles([]);
        setCourses([]);
        setProfilePicData("");
        setTags([]);

        // Alert the user that the user was created
        alert("Success! Your username is " + event_data.data.user_name);
      }
      // If the response is not successful, set the submit status to error
      else {
        setSubmitStatus(response.status);
      }
      console.log(response);
    });
  };

  const handleSubmit = () => {
    get_user_data();
  };

  return (
    <div>
      {/* Text box for username */}
      <div className="form-control w-full mb-6">
        <div className="grid grid-cols-2 grid-flow-row mx-4">
          {/* First name and last name row */}
          <label className="label">
            <span className="label-text mx-4">User Name</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row col-span-2">
            <div className="col-span-1 row-span-1 mr-2">
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full mb-4"
                id="first_name"
                onChange={(e) => set_first_name(e.target.value)}
                value={first_name}
              />
            </div>
            <div className="col-span-1 row-span-1 mr-2">
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full mb-4"
                id="last_name"
                onChange={(e) => set_last_name(e.target.value)}
                value={last_name}
              />
            </div>
          </div>
          {/* Password confirmation row */}
          <label className="label">
            <span className="label-text mx-4">Password</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row col-span-2">
            <div className="col-span-1 row-span-1 mr-2">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full mb-4"
                id="password"
                onChange={(e) => set_password(e.target.value)}
                value={password}
              />
            </div>
            <div className="col-span-1 row-span-1 mr-2">
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered w-full"
                id="confirm_password"
                onChange={(e) => set_confirm_password(e.target.value)}
                value={confirm_password}
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
              <div className="collapse-title text-md font-medium">
                Role selection
              </div>
              <div className="collapse-content">
                {/* Map roles to checkboxes */}
                {role_names.map((role) => (
                  <div key={role}>
                    {/* Put checkbox and role next to each other horizontally */}
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="checkbox"
                        id={`${role}_checkbox`}
                        onChange={(e) => {
                          // If the checkbox is checked, add the role to the roles array
                          if (e.target.checked) {
                            setRoles([...roles, role]);
                          }
                          // If the checkbox is unchecked, remove the role from the roles array
                          else {
                            setRoles(roles.filter((r) => r !== role));
                          }
                        }}
                      />
                      <span className=" ml-4 checkbox-label-text">{role}</span>
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
              <div className="collapse-title text-md font-medium">
                Course selection
              </div>
              <div className="collapse-content">
                {/* Map roles to checkboxes */}
                {course_data.map((course) => (
                  <div key={course.course_id}>
                    {/* Put checkbox and course next to each other horizontally */}
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        className="checkbox"
                        id={`${course.course_id}_checkbox`}
                        onChange={(e) => {
                          // If the checkbox is checked, add the course to the courses array
                          if (e.target.checked) {
                            setCourses([...courses, course.course_id]);
                          }
                          // If the checkbox is unchecked, remove the course from the courses array
                          else {
                            setCourses(
                              courses.filter((c) => c !== course.course_id)
                            );
                          }
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
      {/* When user presses button, run handleSubmit */}
      {/* If submitStatus is "submitting", change button to circle loader */}
      {submitStatus === "submitting" ? (
        <div className="m-4">
          <CircularProgress />
        </div>
      ) : (
        <button className="btn btn-primary m-4" onClick={handleSubmit}>
          Create User
        </button>
      )}
    </div>
  );
};

export default CreateUser;
