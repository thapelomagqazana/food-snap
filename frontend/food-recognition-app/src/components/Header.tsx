import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="container d-flex justify-content-center align-items-center">
        {/* Clickable logo */}
        <a href="/" aria-label="Navigate to Home">
          <img
            src="/logo.png" // Replace with your actual logo file
            alt="FoodTrack Logo"
            className="app-logo"
          />
        </a>
        {/* Tagline */}
        <div className="app-tagline">Your Nutrition Buddy</div>
      </div>
    </header>
  );
};

export default Header;
