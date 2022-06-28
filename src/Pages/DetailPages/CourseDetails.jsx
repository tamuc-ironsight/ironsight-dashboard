import React from "react";
import "../../App.css";
import Navbar from "../../Components/Navbar";
import { useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import { getCourseList } from "../../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";
import LabTable from "../../Components/DetailPageComponents/LabsTable";
import StudentTable from "../../Components/DetailPageComponents/StudentsTable";
import VirtualMachinesTable from "../../Components/DetailPageComponents/VirtualMachinesTable";

function CourseDetails() {
  const { course_id } = useParams();
  const { data, isLoading, isError } = useQuery("course_list", getCourseList);
  const [selectedTab, setSelectedTab] = React.useState("students");

  if (isLoading) {
    console.log("[Ironsight] Fetching Course Data...");
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  const set_selected_tab = (tab) => {
    setSelectedTab(tab);
  };

  var course_data = data.find((course) => course.course_id === course_id);

  return (
    <div className="courses">
      <Navbar />

      {/* Top bar (breadcrumbs) */}
      <div className="text-md breadcrumbs m-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <strong>{course_data.course_name}</strong>
          </li>
        </ul>
      </div>

      {/* Sidebar with Labs, Students, and Virtual Machines tabs */}
      <div className="grid grid-cols-5 gap-4 m-4 h-[80%]">
        <div className="row-span-1 col-span-5 lg:col-span-1">
          <div className="rounded-box w-full h-full bg-base-100 shadow-xl">
            <div className="sidebar-links">
              {/* Display rows but highlight the one using selectedTab */}
              <div className="grid grid-cols-3 lg:grid-cols-1 grid-flow-row gap-4 mx-4">
                <button
                  className={
                    selectedTab === "students"
                      ? "btn btn-primary w-full text-base-900 hover cursor-pointer mt-4 mb-4 lg:mb-0"
                      : "btn btn-outline w-full text-base-900 hover cursor-pointer mt-4 mb-4 md:mb-0"
                  }
                  onClick={() => set_selected_tab("students")}
                >
                  Students
                </button>
                <button
                  className={
                    selectedTab === "labs"
                      ? "btn btn-primary w-full text-base-900 hover cursor-pointer mt-4 lg:mt-0"
                      : "btn btn-outline w-full text-base-900 hover cursor-pointer mt-4 lg:mt-0"
                  }
                  onClick={() => set_selected_tab("labs")}
                >
                  Labs
                </button>
                <button
                  className={
                    selectedTab === "virtual_machines"
                      ? "btn btn-primary w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                      : "btn btn-outline w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                  }
                  onClick={() => set_selected_tab("virtual_machines")}
                >
                  Virtual Machines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="rounded-box row-span-1 col-span-5 lg:col-span-4 h-full overflow-auto">
          <div className="w-full h-full bg-base-100 shadow-xl">
            <div className="course-content">
              {/* Display the selected tab */}

              {/* Labs */}
              {selectedTab === "labs" && <LabTable course_id={course_id} />}

              {/* Students */}
              {selectedTab === "students" && (
                <StudentTable course_id={course_id} />
              )}

              {/* Virtual Machines */}
              {selectedTab === "virtual_machines" && (
                <VirtualMachinesTable course_id={course_id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
