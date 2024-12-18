import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import { Navigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const nutritionalSummary = {
    calories: 1500,
    protein: 60,
    carbs: 180,
    fats: 50,
  };

  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container bg-light min-vh-100">
      {/* Main Content */}
      <div className="container mt-4">
        <h2 className="text-center mb-4 dashboard-btn">Your Dashboard</h2>

        {/* Nutritional Summary */}
        <DashboardSummary {...nutritionalSummary} />

        {/* Additional Content Placeholder */}
        <div className="text-center">
          <p className="text-muted">
            Explore your daily meal analysis and nutrition insights here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
