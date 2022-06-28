import React from "react";
import "../App.css";
import ReAreaChart from "../Charts/ReAreaChart";
import ReAreaChartMultiple from "../Charts/ReAreaChartMultiple";

import ReLineChart from "../Charts/ReLineChart";
import Navbar from "../Components/Navbar";

import UserTable from "../Components/UserComponents/UserTable";


function Users() {



  return (
    <div className="users">

      <Navbar />
    
      <div className="overflow-auto w-full">

          <div className=" bg-base-100 shadow-xl rounded-box overflow-auto m-6 xl:mx-48">
            <div className="table w-full">

              <UserTable className=""/>
                 
            </div>
          </div>

      </div>
     

    </div>
    

  );
}

export default Users;
