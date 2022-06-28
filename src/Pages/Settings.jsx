import React from "react";
import "../App.css";
import Navbar from "../Components/Navbar";
import UserSettings from "./DetailPages/UserSettings";
import CreateLab from "../Components/CreateLab";
import CreateCourse from "../Components/CreateCourse";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";

function Settings() {
  const [selectedTab, setSelectedTab] = React.useState("users");

  const set_selected_tab = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="settings">
      <Navbar />

      {/* Top bar (breadcrumbs) */}
      <div className="text-md breadcrumbs m-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <strong>Settings</strong>
          </li>
        </ul>
      </div>

      {/* Sidebar with Labs, Users, and Courses tabs */}
      <div className="grid grid-cols-5 gap-4 m-4 h-[80%]">
        <div className="row-span-1 col-span-5 lg:col-span-1">
          <div className="rounded-box w-full h-full bg-base-100 shadow-xl">
            <div className="sidebar-links">
              {/* Display rows but highlight the one using selectedTab */}
              <div className="grid grid-cols-3 lg:grid-cols-1 grid-flow-row gap-4 mx-4">
                <button
                  className={
                    selectedTab === "users"
                      ? "btn btn-primary w-full text-base-900 hover cursor-pointer mt-4 mb-4 lg:mb-0"
                      : "btn btn-outline w-full text-base-900 hover cursor-pointer mt-4 mb-4 md:mb-0"
                  }
                  onClick={() => set_selected_tab("users")}
                >
                  Users
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
                    selectedTab === "courses"
                      ? "btn btn-primary w-full text-base-900 hover cursor-pointer mt-4 lg:mt-0"
                      : "btn btn-outline w-full text-base-900 hover cursor-pointer mt-4 lg:mt-0"
                  }
                  onClick={() => set_selected_tab("courses")}
                >
                  Courses
                </button>
                <button
                  className={
                    selectedTab === "tags"
                      ? "btn btn-primary w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                      : "btn btn-outline w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                  }
                  onClick={() => set_selected_tab("tags")}
                >
                  Tags
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
              {selectedTab === "labs" && <CreateLab />}

              {/* Users */}
              {selectedTab === "users" && <UserSettings />}

              {/* Courses */}
              {selectedTab === "courses" && <CreateCourse />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
