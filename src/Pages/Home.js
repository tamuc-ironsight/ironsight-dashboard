import React, { Component } from "react";
import "../App.css";
import HypervisorCPUWidget from "../Components/Widgets/Hypervisor/HypervisorCPUWidget";
import HypervisorNetworkWidget from "../Components/Widgets/Hypervisor/HypervisorNetworkWidget";
import HypervisorMemoryWidget from "../Components/Widgets/Hypervisor/HypervisorMemoryWidget";
import HypervisorDiskWidget from "../Components/Widgets/Hypervisor/HypervisorDiskWidget";
import OngoingLabs from "../Components/Widgets/OngoingLabs";
import NewsWidget from "../Components/Widgets/NewsWidget";
import Navbar from "../Components/Navbar";
import VMCPUWidgetHome from "../Components/Widgets/VMStats/VMCPUWidgetHome";
import MiniVMStatsWidget from "../Components/Widgets/VMStats/MiniVMStatsWidget";
import ActivityLog from "../Components/Widgets/ActivityLog";
import ErrorBoundary from "../Components/ErrorBoundary";

class Home extends Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="home">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 md:mx-3 max-h-[90%]">
            {/* Upper row */}
            {/* Ongoing Labs */}
            <div className="col-span-1 row-span-1 rounded-box bg-base-100 shadow-xl m-3">
              <div className="card-body p-4 md:p-8">
                <div className="flex flex-row">
                  <h2 className="card-title mr-3">Ongoing Labs</h2>

                  {/* Display the current date */}
                  <h3 className="font-mono text-lg mr-3">
                    [{new Date().toLocaleDateString()}]
                  </h3>
                </div>
                <OngoingLabs />
              </div>
            </div>

            {/* VM Overview */}
            <div className="md:col-span-2 row-span-1 rounded-box bg-base-100 shadow-xl m-3">
              <div className="flex flex-col card-body p-4 md:p-8">
                <h2 className="card-title">VM Performance</h2>
                <div className="grid grid-flow-col grid-rows-4 md:grid-rows-1">
                  <div className="col-span-1 row-span-3">
                    <ErrorBoundary>
                      <VMCPUWidgetHome />
                    </ErrorBoundary>
                  </div>

                  <div className="col-span-1 row-span-1">
                    <MiniVMStatsWidget />
                  </div>
                </div>
              </div>
            </div>

            {/* News Widget */}
            <div className="col-span-1 row-span-1 rounded-box bg-base-100 shadow-xl m-3">
              <div className="card-body p-4 md:p-8 max-h-96">
                <div className="flex flex-row">
                  <h2 className="card-title">News / Alerts</h2>
                </div>
                <NewsWidget />
              </div>
            </div>

            {/* Lower Row */}
            {/* Hypervisor Performance */}
            <div className="md:col-span-2 row-span-1 rounded-box bg-base-100 shadow-xl m-3">
              <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Hypervisor Performance</h2>
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col md:w-1/2 text-center text-sm">
                    CPU Usage
                    <HypervisorCPUWidget />
                    {/* <HypervisorNetworkWidget /> */}
                  </div>
                  <div className="flex flex-col md:w-1/2 text-center text-sm">
                    Memory Usage
                    <HypervisorMemoryWidget />
                    {/* <HypervisorDiskWidget /> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2 row-span-1 rounded-box bg-base-100 shadow-xl m-3">
              <div className="card-body p-4 md:p-8">
                <h2 className="card-title">Recent Activity</h2>
                <ErrorBoundary>
                  <ActivityLog />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
