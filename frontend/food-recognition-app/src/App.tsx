import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ImageAnalysisPage from "./pages/ImageAnalysisPage";

import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import EmailVerification from "./components/register/EmailVerification";
import NutritionalOverview from "./components/results/NutritionalOverview";

import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><ImageAnalysisPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/nutrition-overview" element={<ProtectedRoute><NutritionalOverview /></ProtectedRoute>} />
        </Routes>
      <Footer />
    </div>
  );
};

export default App;
