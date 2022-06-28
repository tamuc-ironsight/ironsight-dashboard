import React from "react";
import "../App.css";
import Navbar from "../Components/Navbar";

import CreateUser from "../Components/CreateUser";
import CreateLab from "../Components/CreateLab";
import CreateCourse from "../Components/CreateCourse";

const Testing = () => {
  return (
    <div className="testing">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-row gap-4 m-4">
        {/* User creation testing */}
        <div className="col-span-1 rounded-box bg-base-100">
          <h2 className="collapse-title text-center text-base-900">
            User Creation
          </h2>
          <CreateUser />
        </div>
        <div className="col-span-2 rounded-box bg-base-100">
        <h2 className="collapse-title text-center text-base-900">
            Lab Creation
          </h2>
          <CreateLab />
        </div>
        <div className="col-span-1 rounded-box bg-base-100">
        <h2 className="collapse-title text-center text-base-900">
            Course Creation
          </h2>
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default Testing;
