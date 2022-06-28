import React from "react";
import "../App.css";
import Navbar from "../Components/Navbar";
import LinearProgress from "@mui/material/LinearProgress";

function Sandbox() {

  return (
    <div className="sandbox">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-4 m-4">
      </div>
    </div>
  );
}

export default Sandbox;
