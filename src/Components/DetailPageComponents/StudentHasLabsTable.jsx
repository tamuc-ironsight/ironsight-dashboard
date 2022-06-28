import React from "react";
import "../../App.css";
import { useQuery } from "react-query";
import { getLabOverview, getUsersList } from "../../IronsightAPI";
import { Link } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams } from "react-router-dom";



const StudentsLabsTable = ({ course_id }) => {  
  const { lab_num } = useParams();
  const {
    data: lab_overview_data,
    isLoading: isLoading_lab_overview_table_students,
    isError: isError_lab_overview_table_students,
  } = useQuery(["lab_overview_student", lab_num], getLabOverview);

  const {
    data: userData,
    isLoading: isLoading_user,
    isError: isError_user,
  } = useQuery("users_list", getUsersList);

  if (isLoading_lab_overview_table_students || isLoading_user) {
    return <LinearProgress />;
  }

  if (isError_lab_overview_table_students || isError_user) {
    return <p>Error!</p>;
  }

  var raw_lab_data = [];
  var raw_student_data = [];
  raw_student_data = userData;
  raw_lab_data = lab_overview_data;
  var filtered_students = [];

  for (var i = 0; i < raw_student_data.length; i++) {
    for (var j = 0; j < raw_lab_data.users.length; j++) {
      if (raw_student_data[i].user_name === raw_lab_data.users[j]) {
        filtered_students.push(raw_student_data[i]);
      }
    }
  }

  // Pull in all students and display them on the table
  var table_html = filtered_students.map(function (student) {
    // Capitalize the first letter of the first name
    var first_name =
      student.first_name.charAt(0).toUpperCase() + student.first_name.slice(1);
    // Capitalize the first letter of the last name
    var last_name =
      student.last_name.charAt(0).toUpperCase() + student.last_name.slice(1);
    var student_email = student.user_name + "@example.edu";
    // Check the tags to see if the student is a student or a professor
    var user_role = student.roles[0];
    // Check for a link to a profile picture
    var profile_pic_data = "";
    if (student.profile_pic_data !== "") {
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
        student_major = student_major
          .split(" ")
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ");
      }
    }
    if (student_major === "") {
      student_major = "N/A";
    } else {
    }
    
      return (
        <tr key={student.user_name} className="hover">
          <td>
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img src={profile_pic_data} alt="User Avatar" />
                </div>
              </div>
              <div>
                <Link
                  to={"/lab_details/" + lab_num + "/" + student.user_name}
                  key={student.user_name + "_link"}
                >
                  <div className="font-bold">
                    {first_name} {last_name}
                  </div>
                  <div className="text-sm opacity-50">{student_major}</div>
                </Link>
              </div>
            </div>
          </td>
          <td>{student_email}</td>
          <td>********</td>
          <td>{user_role}</td>
        </tr>
      );
    
  });

  //   Take the raw JSON and turn it into the rows of the table

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            <td>Name</td>
            <th>Email</th>
            <th>Student ID</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{table_html}</tbody>
      </table>
    </div>
  );
};

export default StudentsLabsTable;
