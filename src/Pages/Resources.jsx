import React from "react";
import "../App.css";
import Navbar from "../Components/Navbar";
import HypervisorCPUWidget from "../Components/Widgets/Hypervisor/HypervisorNetworkWidget";
import HypervisorNetworkWidget from "../Components/Widgets/Hypervisor/HypervisorNetworkWidget";
import HypervisorMemoryWidget from "../Components/Widgets/Hypervisor/HypervisorMemoryWidget";
import HypervisorDiskWidget from "../Components/Widgets/Hypervisor/HypervisorDiskWidget";
import VMsOnWidget from "../Components/Widgets/VMStats/VMsOnWidget";
import VMsTotalWidget from "../Components/Widgets/VMStats/VMsTotalWidget";
import MemoryProgress from "../Charts/MemoryProgress";
import CPUProgress from "../Charts/CPUProgress";
import ReAreaChartMultiple from "../Charts/ReAreaChartMultiple";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function Resources() {
  return (
    <div className="resources">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-3 grid-flow-row mx-4 mt-6 gap-6">
        <div className="col-span-1 rounded-box bg-base-100 shadow-md self-center">
          <legend className="text-xl font-bold text-white-800 m-4">
            <a href="#">Virtual Machines</a>
          </legend>
          <div className="card-body">
            <div className="card-title mb-5">
              <VMsOnWidget />
              <VMsTotalWidget />
            </div>
          </div>
          </div>

          <div className="col-span-1 rounded-box bg-base-100 shadow-xl self-center">
            <legend className="text-xl font-bold text-white-800 mr-4 mt-4 ml-4">
              <a href="#">Memory Usage</a>
            </legend>
            <div className="card-body">
              <MemoryProgress />
            </div>
        </div>

          <div className="col-span-1 rounded-box bg-base-100 shadow-xl self-center">
            <legend className="text-xl font-bold text-white-800 mr-4 mt-4 ml-4">
              <a href="#">CPU Usage</a>
            </legend>
            <div className="card-body">
              <CPUProgress />
            </div>
          </div>

        <div className="col-span-1 md:col-span-3">
          <div className="md:w-full rounded-box bg-base-100 shadow-xl self-center">
            <div className="card-body">
              CPU Usage:
              <ReAreaChartMultiple />
            </div>
          </div>
        </div>

        <div className="col-span-1 rounded-box bg-base-100 shadow-xl self-center">
          <div className="card-body">
            CPU(I/O) Usage:
            <HypervisorCPUWidget />
          </div>
        </div>
        <div className="col-span-1 rounded-box bg-base-100 shadow-xl self-center">
          <div className="card-body">
            Memory
            <HypervisorMemoryWidget />
          </div>
        </div>
        <div className="col-span-1 rounded-box bg-base-100 shadow-xl self-center">
          <div className="card-body">
            Network(I/O):
            <HypervisorNetworkWidget />
          </div>
        </div>

        <div className="col-span-1 md:col-span-3">
          <div className="md:w-full rounded-box bg-base-100 shadow-xl mb-6 self-center">
            <div className="card-body">
              Disk Utilization(I/O):
              <HypervisorDiskWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
