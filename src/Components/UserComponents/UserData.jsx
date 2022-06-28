import React from "react";
import { useQuery } from "react-query";

import {
  getHarvesterVMList,
  getLabList,
  getUsersList,
  getTags,
} from "../../IronsightAPI";

import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";
import CourseDetails from "../../Pages/DetailPages/CourseDetails";

const useUserData = () => {
  // State for holding final data

  const { data, isLoading, isError } = useQuery(
    "harvester_vms",
    getHarvesterVMList
  );

  const {
    data: harvester_data,
    isLoading: harvester_isLoading,
    isError: harvester_isError,
  } = useQuery("harvester_vms", getHarvesterVMList);

  const {
    data: lab_data,
    isLoading: lab_isLoading,
    isError: lab_isError,
  } = useQuery("labs", getLabList);

  const {
    data: tags_data,
    isLoading: isLoading_tags,
    isError: isError_tags,
  } = useQuery("tags_list", getTags);

  const {
    data: users_data,
    isLoading: users_isLoading,
    isError: users_isError,
  } = useQuery("users_list", getUsersList);

  if (
    isLoading ||
    harvester_isLoading ||
    lab_isLoading ||
    users_isLoading ||
    isLoading_tags
  ) {
    return;
  }

  if (
    isError ||
    harvester_isError ||
    lab_isError ||
    users_isError ||
    isError_tags
  ) {
    return;
  }

  if (!users_data) {
    return;
  }

  var majors = [];
  for (let i = 0; i < tags_data.length; i++) {
    if (tags_data[i].type === "major") {
      majors.push(tags_data[i].tag);
    }
  }

  var raw_student_data = users_data;
  var student_major = "";
  // Pull in all students and display them on the table

  var table_data = raw_student_data.map(function (student) {
    // Capitalize the first letter of the first name
    var first_name =
      student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1);

    // Capitalize the first letter of the last name
    var last_name =
      student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1);

    var student_email = student.user_name + "@example.edu";

    // Check the tags to see if the student is a student or a professor
    var user_role = student.roles[0];

    // Get Full Course Names of the student
    var course_names = [];
    for (let i = 0; i < student.courses.length; i++) {
      course_names.push(student.courses[i].course_name);
    }


    // Get Course Number of the student
    var course_ids = [];
    for (let i = 0; i < student.courses.length; i++) {
      course_ids.push(student.courses[i].course_id);
    }


    // Get Number of courses the student is enrolled in
    var course_num = student.courses.length;

    // Get Number of VM's the student has
    var vm_num = student.virtual_machines.length;

  
    // If courses undefined or empty, set to ---. Else, join courses with a comma
    var course_list = course_names.length === 0 ? "---" : course_names.join(", ");

    // If courses undefined or empty, set to ---. Else, join courses with a comma
    var course_id_list = course_ids.length === 0 ? "---" : course_ids.join(", ");




    // Check for a link to a profile picture
    var profile_pic_data = "";
    if (student.profile_pic_data !== "") {
      profile_pic_data = student["profile_pic_data"];
    } else {
      profile_pic_data =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png";
    }

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
      student_major = "---";
    }

    //Component to make a linked thumbnail for the profile data (Picture, name and major)

    function UserID() {

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
        student_major = "---";
      }

        //get link to user details 
      var user_link = "/user_details/" + student.user_name;

        return (
          <Link
                to={user_link}
                key={student.user_name + "_link"}
          >
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={profile_pic_data} alt="User Avatar" />
                      </div>
                    </div>
                  <div>
                  
                    <div className="font-bold">
                      {first_name} {last_name}
                    </div>
                    <div className="text-sm opacity-50">{student_major}</div>
                  
                </div>
              </div>
          </Link>
        );
    };  


    return {

      thumbnail: <UserID />,
      first_name: first_name,
      last_name: last_name,
      course_num: course_num,
      course_list: course_list,
      course_id_list: course_id_list,
      vm_num: vm_num,
      user_name: student.user_name,
      student_email: student_email,
      student_major: student_major,
      user_role: user_role,
      profile_pic_data: profile_pic_data,
    };
  });

  //TEST push data from the API to an array for the table

  console.log("UD Table Data: ");
  console.log(table_data);

  // return useUserData in the form of an table_data array
  return table_data;
};

export default useUserData;
