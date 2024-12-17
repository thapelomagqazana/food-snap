import React from "react";
import { Card } from "react-bootstrap";
import "./DashboardSummary.css";

interface SummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const DashboardSummary: React.FC<SummaryProps> = ({ calories, protein, carbs, fats }) => {
  return (
    <Card className="dashboard-summary shadow-sm mb-4">
      <Card.Header className="bg-primary text-white text-center">
        <h4>Your Daily Nutritional Summary</h4>
      </Card.Header>
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
