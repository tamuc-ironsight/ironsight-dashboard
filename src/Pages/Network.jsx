import React from "react";
import Navbar from "../Components/Navbar";

function Network() {
  return (
    <>
      <Navbar />
      <div className="network">
        {/* Insert image https://docs.securityonion.net/en/2.3/_images/39_hunt.png */}
        {/* Crop the top 20px */}
        <div className="security-image">
          <img
            src="/assets/sec_onion.png"
            alt="security-image"
            width="100%"
          />
          </div>
      </div>
    </>
  );
}

export default Network;
