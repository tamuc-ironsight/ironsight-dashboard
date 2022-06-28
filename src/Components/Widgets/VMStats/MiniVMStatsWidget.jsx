import React from "react";
import VMsOnWidget from "./VMsOnWidget";
import VMsTotalWidget from "./VMsTotalWidget";

const MiniVMStatsWidget = () => {
  return (
    <div className="flex flex-row md:flex-col">
      <VMsOnWidget />
      <VMsTotalWidget />
    </div>
  );
};

export default MiniVMStatsWidget;
