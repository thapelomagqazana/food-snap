import React from "react";
import "./WelcomeSection.css";

/**
 * WelcomeSection Component
 * Renders a welcoming section for the Food Recognition App.
 * - Includes a title, a short description, and visually engaging styling.
 * - Designed to grab the user's attention and provide a clear introduction.
 *
 * Features:
 * - Centered layout for a clean, welcoming appearance.
 * - Accessible text with appropriate color contrast.
 * 
 * @returns {JSX.Element} The rendered welcome section component.
 */
const WelcomeSection: React.FC = () => {
  return (
    <div className="welcome-section text-center py-5">
      {/* Welcome Title */}
      <h1 className="welcome-title display-4 fw-bold">
        Welcome to FoodTrack!
      </h1>
      {/* Welcome Description */}
      <p className="welcome-description lead mt-3 mb-4">
        Your personal assistant for food recognition, nutrition tracking, and
        health goals.
      </p>
    </div>
  );
};

export default WelcomeSection;
