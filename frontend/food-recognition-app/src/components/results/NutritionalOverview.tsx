import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Table, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import "./NutritionalOverview.css";

interface Food {
  label: string;
  confidence: string;
  thumbnail: string;
}

const NutritionalOverview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const food: Food | undefined = location.state?.food;

  const [nutrition, setNutrition] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!food) {
      navigate("/"); // Redirect to home if no food item is provided
      return;
    }

    const fetchNutrition = async () => {
      try {
        setError(null);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/nutrition`,
          {
            foodItems: [food.label],
          }
        );
        console.log(response.data);
        // Find the matching food item in the nutrition array
        const matchedNutrition = response.data.nutrition.find(
          (item: any) => item.name.toLowerCase() === food.label.toLowerCase()
        );
        setNutrition(matchedNutrition);
      } catch (err: any) {
        console.error("Error fetching nutritional data:", err.message);
        setError("Failed to fetch nutritional data.");
      }
    };

    fetchNutrition();
  }, [food, navigate]);

  if (!food) {
    return null;
  }

  return (
    <div className="nutritional-overview container mt-4">
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!nutrition && !error && (
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Loading nutritional information...</span>
        </div>
      )}

      {nutrition && (
        <Card>
          <Card.Header>
            <h3 className="text-center dashboard-btn">Nutritional Overview</h3>
          </Card.Header>
          <Card.Body>
            {/* Food Image and Name */}
            <div className="text-center">
              <img
                src={food.thumbnail}
                alt={food.label}
                className="food-thumbnail"
              />
              <h4 className="mt-3">{nutrition.name}</h4>
            </div>

            {/* Nutritional Table */}
            <Table bordered className="text-center mt-4">
              <thead>
                <tr>
                  <th>Calories (kcal)</th>
                  <th>Protein (g)</th>
                  <th>Carbs (g)</th>
                  <th>Fats (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{nutrition.calories}</td>
                  <td>{nutrition.protein}</td>
                  <td>{nutrition.carbs}</td>
                  <td>{nutrition.fats}</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Back Button */}
      <div className="text-center mt-4">
        <Button className="capture-btn" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default NutritionalOverview;
