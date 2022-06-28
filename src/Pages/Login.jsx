import React from "react";
import "../App.css";
import ThemeButton from "../Components/ThemeButton";
import { authenticate, postActivityLog } from "../IronsightAPI";
import CircularProgress from "@mui/material/CircularProgress";

//   Get clients remote IP address and log to console
const get_client_ip = () => {
  var client_ip = "";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://ip.jsontest.com/", false);
  xhr.send();
  if (xhr.status === 200) {
    client_ip = xhr.responseText;
  }
  return client_ip;
};

// Submit login function, console.log the username and password
function submitLogin() {
  var username = document.getElementById("ironsight_username").value;
  var password = document.getElementById("ironsight_password").value;
  //   Try catch block to handle errors
  try {
    var status = authenticate(username, password);
    // Handle pending promise
    status.then(function (data) {
      console.log(data);
      if (data === "success") {
        console.log("Login successful!");
        try {
          const client_ip = get_client_ip();
          // Parse JSON string to object from client_ip
          const client_ip_obj = JSON.parse(client_ip);
          // Log client IP address to activity log
          postActivityLog(
            username,
            "[Ironsight] Logged in from " + client_ip_obj.ip
          );
        } catch (error) {
          console.log(error);
        }
        localStorage.setItem("ironsight_token", "test");
        localStorage.setItem("ironsight_username", username);
        // Wait until the promise is resolved
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
      }
      if (data === "wrong_password") {
        console.log("Wrong password!");
        try {
          const client_ip = get_client_ip();
          // Parse JSON string to object from client_ip
          const client_ip_obj = JSON.parse(client_ip);
          // Log client IP address to activity log
          postActivityLog(
            username,
            "[Ironsight] Failed login from " +
              client_ip_obj.ip +
              ", Reason: Wrong Password"
          );
        } catch (error) {
          console.log(error);
        }
        alert("Wrong password!");
      }
      if (data === "user_not_found") {
        console.log("User not found!");
        try {
          const client_ip = get_client_ip();
          // Parse JSON string to object from client_ip
          const client_ip_obj = JSON.parse(client_ip);
          // Log client IP address to activity log
          postActivityLog(
            username,
            "[Ironsight] Failed login from " +
              client_ip_obj.ip +
              ", Reason: User not found"
          );
        } catch (error) {
          console.log(error);
        }
        alert("User not found!");
      }
    });
  } catch (error) {
    // Catch any errors
    console.log(error);
    alert("Error: " + error);
  }
}

const Login = () => {
  // State for isLoggingIn
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  return (
    <div className="login min-w-max fill-window h-screen bg-slate-800">
      <div className="flex justify-end m-4">
        <ThemeButton />
      </div>
      <div className="flex md:m-0 min-h-[80%]">
        <div className="flex w-full mx-4 md:mx-0 min-h-full justify-center m-auto">
          <div className="card w-full md:w-[48rem] bg-base-100 shadow-xl">
            <img
              className="block h-8 mx-auto mt-4"
              src={"/logo_horizontal.png"}
              alt="Ironsight Banner"
            />
            <div className="form-control card-body p-4 md:p-8">
              <label className="input-group input-group-vertical">
                <span>Username</span>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered"
                  id="ironsight_username"
                />
              </label>
              <label className="input-group input-group-vertical mt-4">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered input-password"
                  id="ironsight_password"
                />
              </label>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-ghost">Forgot Password</button>
                {/* If isLoading, load a MUI spinner, otherwise do login button */}
                {isLoggingIn ? (
                  <CircularProgress />
                ) : (
                  <button
                    onClick={() => {
                      setIsLoggingIn(true);
                      submitLogin();
                    }
                    }
                    className="btn btn-primary"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
