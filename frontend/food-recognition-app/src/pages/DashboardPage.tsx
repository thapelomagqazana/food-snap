import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mt-5">
      <h1>Welcome to your Dashboard!</h1>
      <p>Here is your daily nutritional data...</p>
    </div>
  );
};

export default DashboardPage;
