import React from "react";

const UsersWidget = () => {
  const [user_list, setUserList] = React.useState("");

  const get_users = () => {
    fetch(`${process.env.REACT_APP_IRONSIGHT_API_URL}/get.php?q=get_users")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        var user_list = data.map(function (user) {
          return (
            <tr className="hover">
              <td>{user.user_name}</td>
            </tr>
          );
        });
        setUserList(user_list);
      });
  };
  React.useEffect(() => {
    get_users();
  }, []);

  return (
    <div className="md:w-1/4 rounded-box bg-base-100 shadow-xl m-3">
      <div className="card-body">
        <h2 className="card-title">Users</h2>
        <div className="overflow-x-auto max-h-64">
          <table className="table w-full">
            <tbody>{user_list}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersWidget;
