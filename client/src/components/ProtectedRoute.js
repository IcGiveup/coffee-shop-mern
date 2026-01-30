import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("ProtectedRoute user:", currentUser);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

