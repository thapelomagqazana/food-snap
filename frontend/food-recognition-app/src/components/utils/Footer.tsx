import React from "react";
import "./Footer.css";

/**
 * Footer Component
 * Renders the footer section of the app, displaying:
 * - Current year and app name with a tagline.
 * - Links to the Privacy Policy and Support.
 *
 * Features:
 * - Responsive design for optimal viewing on all devices.
 * - Accessible links for navigation and support.
 * 
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer: React.FC = () => {
  return (
    <footer className="app-footer bg-light text-center py-4">
      <div className="footer-container">
        {/* Footer Text: Year and App Name */}
        <p className="mb-2">
          &copy; {new Date().getFullYear()} <strong>FoodTrack</strong> - Your Nutrition Buddy
        </p>
        
        {/* Footer Links */}
        <div className="footer-links">
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <span className="mx-2 text-muted">{" "}|{" "}</span>
          <a href="mailto:support@foodtrack.com" className="footer-link">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
