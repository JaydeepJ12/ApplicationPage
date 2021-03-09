import React from "react";
import Login from "../components/Login/index";

const PrivateRoute = ({ as: Component, ...props }) => {
  let token = localStorage.getItem("token");
  let path = props.location.pathname;
  let parts = path.split("/");
  path = parts[parts.length - 1];
  let isLoginPage = path === "login";

  let logOutMessage = "";
  if (!token && !isLoginPage) {
    logOutMessage =
      "Your session has expired. Please login again and start a fresh session.";
  }
  return (
    <div>
      {token ? (
        <Component {...props} />
      ) : (
        <Login logOutMessage={logOutMessage} />
      )}
    </div>
  );
};

export default PrivateRoute;
