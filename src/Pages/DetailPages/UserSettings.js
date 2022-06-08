import React from "react";
import "../../App.css";
import CreateUser from "../../Components/CreateUser";
import ManageUsers from "../../Components/DetailPageComponents/ManageUsers";

const UserSettings = () => {
  const [selectedTab, setSelectedTab] = React.useState("manage_users");

  return (
    <div className="settings">
      <div className="flex flex-row">
        <div className="btn-group m-4">
          <button
            className={selectedTab == "manage_users" ? "btn btn-active" : "btn"}
            onClick={() => setSelectedTab("manage_users")}
          >
            Manage Users
          </button>
          <button
            className={selectedTab == "create_user" ? "btn btn-active" : "btn"}
            onClick={() => setSelectedTab("create_user")}
          >
            Create User
          </button>
        </div>
      </div>
      {selectedTab == "create_user" ? <CreateUser /> : <ManageUsers />}
    </div>
  );
};

export default UserSettings;
