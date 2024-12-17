import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./NavigationButtons.css";

const NavigationButtons: React.FC = () => {
  return (
    <div className="nav-buttons">
      {/* Register Button */}
      <Button href="/register" className="btn register-btn">
        <i className="bi bi-person-plus me-2"></i> Register
      </Button>

      {/* Login Button */}
      <Button href="/login" className="btn login-btn">
        <i className="bi bi-key me-2"></i> Log In
      </Button>

      {/* Explore as Guest Button */}
      <Button href="/explore" className="btn explore-btn">
        <i className="bi bi-search me-2"></i> Explore as Guest
      </Button>
    </div>
  );
};

export default NavigationButtons;
