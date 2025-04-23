import React from "react";
import Login from "./login";
import Register from "./register";

function Auth() {
  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ height: "100vh", backgroundColor: "#f4f7fc" }}>
      <div className="login-container p-4 rounded shadow-sm" style={{ backgroundColor: "white", maxWidth: "400px", width: "100%" }}>
        <Login />
      </div>
    </div>
  );
}

export default Auth;
