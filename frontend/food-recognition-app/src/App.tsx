import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import Background from "./components/Background";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmailVerification from "./components/register/EmailVerification";

const App: React.FC = () => {
  return (
    <Background>
      <Header />
      <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </Router>
      <Footer />
    </Background>

  );
};

export default App;
