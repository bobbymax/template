import React from "react";
import { Navigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import "../css/style.css";
import Sidebar from "./layouts/Sidebar";

const ProtectedRoute = ({ children }) => {
  const { auth } = useStateContext();
  return (
    <div className="wrapper">
      {/* Sidebar Here */}
      <Sidebar />
      {auth ? children : <Navigate to="/auth/login" />}
    </div>
  );
};

export default ProtectedRoute;
