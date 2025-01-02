import React from "react";
import WelcomeSection from "../components/landing/WelcomeSection";
import NavigationButtons from "../components/landing/NavigationButtons";

const LandingPage: React.FC = () => {
  return (
    <div className="home-screen bg-light vh-100 d-flex flex-column justify-content-center">
      <WelcomeSection />
      <NavigationButtons />
    </div>
  );
};

export default LandingPage;
