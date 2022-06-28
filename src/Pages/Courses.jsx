import React from "react";
import "../App.css";
import Navbar from "../Components/Navbar";
import { useQuery } from "react-query";
import { getCourseList } from "../IronsightAPI";
import LinearProgress from "@mui/material/LinearProgress";
import CourseCard from "../Components/DetailPageComponents/CourseCard";
import { Link } from "react-router-dom";

function Courses() {
  const { data, isLoading, isError } = useQuery("course_list", getCourseList);

  if (isLoading) {
    console.log("[Ironsight] Fetching Course Data...");
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  var course_cards = data.map(({ course_id, course_name, course_thumbnail }) => (
    <CourseCard key={course_id} course_name={course_name} course_id={course_id} course_thumbnail={course_thumbnail}/>
  ));

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
            <strong>Courses</strong>
          </li>
        </ul>
      </div>
      <div>
        {/* Course cards */}
        {/* If cards are going to off the screen, make them go into the next column */}
        <div className="grid grid-cols-1 md:flex md:flex-wrap m-4 gap-4 md:gap-8">{course_cards}</div>
      </div>
    </div>
  );
}

export default Courses;
