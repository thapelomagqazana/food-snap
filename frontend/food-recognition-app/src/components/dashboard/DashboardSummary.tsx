import React from "react";
import { Card } from "react-bootstrap";
import "./DashboardSummary.css";

/**
 * DashboardSummary Component
 * Displays a summary of the user's daily nutritional intake.
 * 
 * Props:
 * - calories: Total calories consumed (in kcal).
 * - protein: Total protein consumed (in grams).
 * - carbs: Total carbohydrates consumed (in grams).
 * - fats: Total fats consumed (in grams).
 * 
 * Features:
 * - Styled card component with a header and detailed list of nutritional values.
 * - Responsive design for optimal display on all devices.
 * 
 * @returns {JSX.Element} The rendered dashboard summary component.
 */
interface SummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const DashboardSummary: React.FC<SummaryProps> = ({ calories, protein, carbs, fats }) => {
  return (
    <Card className="dashboard-summary shadow-sm mb-4">
      {/* Header Section */}
      <Card.Header className="summary-header text-white text-center">
        <h4>Your Daily Nutritional Summary</h4>
      </Card.Header>

      {/* Nutritional Details */}
      <Card.Body>
        <ul className="list-group list-group-flush text-center">
          <li className="list-group-item">
            <strong>Calories:</strong> {calories} kcal
          </li>
          <li className="list-group-item">
            <strong>Protein:</strong> {protein} g
          </li>
          <li className="list-group-item">
            <strong>Carbs:</strong> {carbs} g
          </li>
          <li className="list-group-item">
            <strong>Fats:</strong> {fats} g
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
};

export default DashboardSummary;
