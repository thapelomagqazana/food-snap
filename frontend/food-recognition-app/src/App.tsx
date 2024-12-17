import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import Header from "./components/Header";
import Footer from "./components/Footer";
import EmailVerification from "./components/register/EmailVerification";

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
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      <Footer />
    </div>
  );
};

export default App;
