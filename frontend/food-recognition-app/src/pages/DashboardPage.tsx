import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import { Navigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mt-5">
      <DashboardSummary />
    </div>
  );
};

export default DashboardPage;
