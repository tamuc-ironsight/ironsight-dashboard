import React from "react";
import "../../App.css";
import Navbar from "../../Components/Navbar";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getUsersList, getCourseList } from "../../IronsightAPI";
import LabTable from "../../Components/DetailPageComponents/LabsTable";
import VirtualMachineTable from "../../Components/DetailPageComponents/VirtualMachinesTable";
import CourseCard from "../../Components/DetailPageComponents/CourseCard";

function UserDetails() {
  const { user_name } = useParams();
  const {
    data: user_data,
    isLoading: isLoading_user,
    isError: isError_user,
  } = useQuery("users_list", getUsersList);

  const {
    data: course_data,
    isLoading: isLoading_course,
    isError: isError_course,
  } = useQuery("course_list", getCourseList);

  var [selectedTab, setSelectedTab] = React.useState("labs");

  if (isLoading_user || isLoading_course) {
    return <LinearProgress />;
  }

  if (isError_user || isError_course) {
    return <p>Error!</p>;
  }

  if (!user_data || !course_data) {
    return;
  }

  var raw_student_data = user_data.map(function (student) {
    // Capitalize the first letter of the first name
    var first_name =
      student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1);
    // Capitalize the first letter of the last name
    var last_name =
      student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1);
    var student_email = student.user_name + "@example.edu";
    // Check the tags to see if the student is a student or a professor
    var user_role = "";
    // If student has a
    if (student.roles.length > 0) {
      user_role = student.roles[0];
    }

    // Check for a link to a profile picture
    var profile_pic_data = "";
    if (student.profile_pic_data !== null) {
      profile_pic_data = student["profile_pic_data"];
    } else {
      profile_pic_data =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png";
    }

    var student_major = "";
    for (let i = 0; i < student.tags.length; i++) {
      if (student.tags[i]["type"] === "major") {
        student_major = student.tags[i]["tag"];
        // Capitalize the first letter of each word
        student_major = student_major.split(" ").map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        ).join(" ");
      }
    }
    if (student_major === "") {
      student_major = "N/A";
    }

    if (profile_pic_data === "") {
      profile_pic_data =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png";
    }

    // Return a list of student data
    return {
      first_name: first_name,
      last_name: last_name,
      user_name: student.user_name,
      user_role: user_role,
      profile_pic_data: profile_pic_data,
      major: student_major,
      email: student_email,
      courses: student.courses,
    };
  });

  // Filter the data to only include this student
  var student_data = {};
  for (var i = 0; i < raw_student_data.length; i++) {
    if (raw_student_data[i]["user_name"] === user_name) {
      student_data = raw_student_data[i];
    }
  }

  var course_cards = student_data.courses.map(
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

  return (
    <div className="course_details">
      <Navbar />
      <div className="text-md breadcrumbs m-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <strong>
              {student_data.first_name} {student_data.last_name}
            </strong>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 grid-flow-row m-4 gap-4 h-full">
        <div className="col-span-1 w-full">
          <div className="rounded-box bg-base-100 h-full">
            {/* Profile picture, firstname lastname, etc */}
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center">
                <img
                  src={student_data.profile_pic_data}
                  alt="User Avatar"
                  className="rounded-full w-32 h-32 mt-4"
                />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {student_data.first_name} {student_data.last_name}
                </div>
                <div className="text-sm opacity-50">{student_data.major}</div>
                <div className="text-sm opacity-50 mb-4">{student_data.email}</div>
              </div>
              <div className="sidebar-links w-full">
                {/* Display rows but highlight the one using selectedTab */}
                <div className="grid grid-cols-2 lg:grid-cols-1 grid-flow-row gap-4 mx-4">
                  <button
                    className={
                      selectedTab === "labs"
                        ? "btn btn-primary w-full text-base-900 hover cursor-pointer mt-4 mb-4 lg:mb-0"
                        : "btn btn-outline w-full text-base-900 hover cursor-pointer mt-4 mb-4 md:mb-0"
                    }
                    onClick={() => setSelectedTab("labs")}
                  >
                    Labs
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
                      selectedTab === "courses"
                        ? "btn btn-primary w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                        : "btn btn-outline w-full text-base-900 hover cursor-pointer mb-4 mt-4 lg:mt-0"
                    }
                    onClick={() => setSelectedTab("courses")}
                  >
                    Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-3 rounded-box bg-base-100">
          <div className=" h-full">
            <div className="page-content">
              {/* Display the selected tab */}
              {selectedTab === "labs" && <LabTable user_name={user_name} />}
              {selectedTab === "virtual_machines" && (
                <VirtualMachineTable user_name={user_name} />
              )}
              {selectedTab === "courses" && (
                <div className="mt-4 grid grid-cols-1 md:flex md:flex-wrap mx-4 gap-4 md:gap-4">
                  {course_cards}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
