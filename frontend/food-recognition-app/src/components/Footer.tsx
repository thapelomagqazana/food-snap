import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="app-footer bg-light text-center py-4">
          <div className="footer-container">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} <strong>FoodTrack</strong> - Your Nutrition Buddy
            </p>
            <div className="footer-links">
              <a href="/privacy" className="footer-link">
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
