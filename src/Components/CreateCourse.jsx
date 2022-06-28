import React from "react";
import "../App.css";
import { handleEvent } from "../IronsightAPI";
import CircularProgress from "@mui/material/CircularProgress";

const CreateCourse = () => {
  const [submitStatus, setSubmitStatus] = React.useState("");
  // Function to print out JSON of selected courses and roles, firstname, lastname, etc.
  const get_course_data = () => {
    setSubmitStatus("submitting");
    // Create a JSON object to hold the course data
    var event_data = {
      action: "create",
      type: "course",
      data: {
        course_name: "test_course",
        course_id: "csci_999",
        thumbnail: "https://imageio.forbes.com/specials-images/imageserve/513343414/0x0.jpg",
        tags: ["cybersecurity"],
      },
    };
    // Submit the event to the API and get the response
    handleEvent(event_data).then((response) => {
      // If the response is successful, set the submit status to success
      if (response.status === "success") {
        setSubmitStatus("success");
        // Alert the course that the course was created
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
    get_course_data();
  };
  return (
    <div>
      {submitStatus === "submitting" ? (
        <div className="m-4">
          <CircularProgress />
        </div>
      ) : (
        <button className="btn btn-primary m-4" onClick={handleSubmit}>
          Create Test Course
        </button>
      )}
    </div>
  );
};

export default CreateCourse;
