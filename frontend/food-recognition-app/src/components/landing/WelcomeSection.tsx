import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WelcomeSection.css";

const WelcomeSection: React.FC = () => {
  return (
    <div className="welcome-section text-center py-5">
      <h1 className="welcome-title display-4 fw-bold text-primary">
        Welcome to the Food Recognition App!
      </h1>
      <p className="welcome-description lead mt-3 mb-4 text-muted">
        Easily recognize your meals, track your nutrition, and achieve your health goals.
      </p>
    </div>
  );
};

export default WelcomeSection;
