import React from "react";
import "../App.css";

function SignOut() {
  // Redirect to login page
  localStorage.removeItem("ironsight_token");
  localStorage.removeItem("ironsight_username");
  window.location.href = "#/login";

  return (
    <div className="signout">
      <h2>Signing out...</h2>
    </div>
  );
}

export default SignOut;
