import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course_id, course_name, course_thumbnail, user_name }) => {
  var course_id_friendly = course_id.replace(/_/g, " ");
  course_id_friendly = course_id_friendly.toUpperCase();
  var card_link = `/course_details/${course_id}`
  if (user_name) {
    card_link = `/course_details/${course_id}/${user_name}`
  }
  return (
    <div>
    <Link to={card_link}>
      {/* Course Card */}
      <div className="card md:w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            className="object-cover h-48 min-w-full"
            src={course_thumbnail}
            alt={course_name}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{course_name}</h2>
          <p>{course_id_friendly}</p>
        </div>
      </div>
    </Link>
    </div>

  );
};

export default CourseCard;
