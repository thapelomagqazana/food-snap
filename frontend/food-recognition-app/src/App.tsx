import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Background from "./components/Background";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Background>
      <Header />
      <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </Router>
      <Footer />
    </Background>

  );
};

export default App;
