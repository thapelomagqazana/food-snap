import React from "react";
// import Header from "../components/Header";
import WelcomeSection from "../components/landing/WelcomeSection";
import NavigationButtons from "../components/landing/NavigationButtons";
// import Footer from "../components/Footer";
// import Background from "../components/Background";

const LandingPage: React.FC = () => {
  return (
    <>
      <WelcomeSection />
      <NavigationButtons />
    </>
  );
};

export default LandingPage;
