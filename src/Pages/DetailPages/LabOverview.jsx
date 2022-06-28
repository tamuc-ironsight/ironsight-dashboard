import React from "react";
import "../../App.css";
import Navbar from "../../Components/Navbar";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import CourseCard from "../../Components/DetailPageComponents/CourseCard";
import StudentsLabsTable, {
} from "../../Components/DetailPageComponents/StudentHasLabsTable";
import {
  getLabOverview,
  getCourseList,
  getVMList,
  getLabList,
  getUsersList,
} from "../../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";
import ReAreaChart from "../../Charts/ReAreaChart";

function LabOverview() {
  const { user_name } = useParams();
  const { lab_num } = useParams();
  const {
    data: lab_overview_data,
    isLoading: isLoading_lab_overview,
    isError: isError_lab_overview,
  } = useQuery(["lab_overview", lab_num], getLabOverview);
  const {
    data: course_data,
    isLoading: isLoading_course,
    isError: isError_course,
  } = useQuery("course_list", getCourseList);
  const {
    data: vm_data,
    isLoading: isLoading_vm,
    isError: isError_vm,
  } = useQuery("vm_list", getVMList);
  const {
    data: lab_data,
    isLoading: isLoading_lab,
    isError: isError_lab,
  } = useQuery("lab_list", getLabList);
  const {
    data: user_data,
    isLoading: isLoading_user,
    isError: isError_user,
  } = useQuery("users_list", getUsersList);
  var [selectedTab, setSelectedTab] = React.useState("students");

  if (
    isLoading_lab_overview ||
    isLoading_course ||
    isLoading_vm ||
    isLoading_lab ||
    isLoading_user
  ) {
    return (
      <div>
        <Navbar />
        <LinearProgress />
      </div>
    );
  }

  if (
    isError_lab_overview ||
    isError_course ||
    isError_vm ||
    isError_lab ||
    isError_user
  ) {
    return <p>Error!</p>;
  }

  var course_cards = course_data.map(
    ({ course_id, course_name, course_thumbnail }) => (
      <CourseCard
        key={course_id}
        course_name={course_name}
        course_id={course_id}
        course_thumbnail={course_thumbnail}
        user_name={user_name}
      />
    )
  );

  // If data comes back as {}, return "No data"
  if (Object.keys(lab_overview_data).length === 0) {
    return (
      <div className="labs">
        <Navbar />
        <p className="card-title m-4">Lab not found</p>
      </div>
    );
  }

  var course_id = lab_overview_data.course_id;
  var class_name = "";
  for (let i = 0; i < course_data.length; i++) {
    if (course_data[i].course_id === course_id) {
      class_name = course_data[i].course_name;
    }
  }

  const users = [];
  for (let i = 0; i < lab_overview_data.users.length; i++) {
    users.push(lab_overview_data.users[i]);
  }

  // Map the users to a table
  const getUsersList2 = () => {
    return users.map((user) => (
      <tr key={user} className="hover">
        <td>
          <Link key={user} to={"/user_details/" + user} className="hover">
            {user}{" "}
          </Link>
        </td>
      </tr>
    ));
  };

  const virtual_machines = [];
  for (let i = 0; i < lab_overview_data.virtual_machines.length; i++) {
    virtual_machines.push(lab_overview_data.virtual_machines[i]);
  }

  // Map the virtual machines to a table
  const get_virtual_machines = () => {
    return virtual_machines.map((vm) => (
      <tr key={vm} className="hover">
        <td>
          <Link key={vm} to={"/vm_details/" + vm}>
            {vm}
          </Link>
        </td>
      </tr>
    ));
  };

  const templates = [];
  for (let i = 0; i < lab_overview_data.templates.length; i++) {
    templates.push(lab_overview_data.templates[i]);
  }
  // Map the templates to a table
  const get_templates = () => {
    return templates.map((template) => (
      <tr key={template} className="hover">
        <td>{template}</td>
      </tr>
    ));
  };

  const tags = [];
  for (let i = 0; i < lab_overview_data.tags.length; i++) {
    // Capitalize the first letter of the tag
    const tag = lab_overview_data.tags[i];
    tags.push(tag);
  }

  // Map the tags to a table
  const get_tags = () => {
    return tags.map((tag) => (
      <div className=" badge badge-primary w-25 mx-1 my-4">{tag}</div>
    ));
  };

  return (
    <>
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
            <Link to={"/course_details/" + course_id}>{class_name}</Link>
          </li>
          <li>
            <strong>{lab_overview_data.lab_name}</strong>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 grid-flow-row m-4 gap-4 h-full ">
        <div className="col-span-1 w-full">
          <div className="rounded-box bg-base-100 ">
            {/* Profile picture, firstname lastname, etc */}
            <div className="flex flex-col items-center justify-center ">
            <div className="text-center">
                <img
                // Get random picture from the internet
                  src="/assets/default_lab.png"
                  alt="Lab Picture"
                  className="rounded-full w-32 h-32 mt-4"
                />
              </div>
              <div className="text-center mt-4">
                <div className="text-lg font-bold">
                  {lab_overview_data.lab_name}
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-row mx-4 md:m-4 md:mt-4 overflow-x-auto">
                    <div className="badge badge-info gap-2 mx-1">
                      cryptography
                    </div>
                    <div className="badge badge-success mx-1">networking</div>
                    <div className="badge badge-warning mx-1">linux</div>
                    <div className="badge badge-error ml-1 mr-4 break-after-all whitespace-nowrap">
                      terminal practice
                    </div>
                  </div>
                </div>
                <div className="text-sm opacity-50 mb-4 mx-4">
                  Description: {lab_overview_data.lab_description}
                </div>
                <div className="text-sm opacity-50">
                  {/* Chop off last 3 characters of dates */}
                  Start: {lab_overview_data.date_start.slice(0, -3)}
                </div>
                <div className="text-sm opacity-50 mb-4">
                  End: {lab_overview_data.date_end.slice(0, -3)}
                </div>
              </div>
              <div className="sidebar-links w-full">
                {/* Display rows but highlight the one using selectedTab */}
                <div className="grid grid-cols-2 lg:grid-cols-1 grid-flow-row gap-4 mx-4 ">
                  <button
                    className={
                      selectedTab === "students"
                        ? "btn btn-primary w-full text-base-900 hover cursor-pointer mt-4 mb-4 lg:mb-0"
                        : "btn btn-outline w-full text-base-900 hover cursor-pointer mt-4 mb-4 md:mb-0"
                    }
                    onClick={() => setSelectedTab("students")}
                  >
                    Students
                  </button>
                  <button
                    className={
                      selectedTab === "virtual_machines"
                        ? "btn btn-primary w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0 lg:mb-0"
                        : "btn btn-outline w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0 lg:mb-0"
                    }
                    onClick={() => setSelectedTab("virtual_machines")}
                  >
                    Virtual Machines
                  </button>
                  <button
                    className={
                      selectedTab === "templates"
                        ? "btn btn-primary w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                        : "btn btn-outline w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                    }
                    onClick={() => setSelectedTab("templates")}
                  >
                    Templates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-3 rounded-box bg-base-100 ">
          <div className=" max-h-full ">
            <div className="page-content">
              {/* Display the selected tab */}
              {selectedTab === "students" && <StudentsLabsTable />}

              {selectedTab === "virtual_machines" && (
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>
                          Virtual Machines in {lab_overview_data.lab_name}
                        </th>
                      </tr>
                    </thead>
                    <tbody>{get_virtual_machines()}</tbody>
                  </table>
                </div>
              )}
              {selectedTab === "courses" && (
                <div className="mt-4 grid grid-cols-1 md:flex md:flex-wrap mx-4 gap-4 md:gap-4">
                  {course_cards}
                </div>
              )}
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default LabOverview;
