import React from "react";
import { ListGroup, Badge, Image } from "react-bootstrap";
import "./FoodDetectionResults.css";

interface Detection {
  label: string;
  confidence: string;
  bbox: number[];
  thumbnail: string;
}

interface FoodDetectionResultsProps {
  detections: Detection[];
}

const FoodDetectionResults: React.FC<FoodDetectionResultsProps> = ({
  detections,
}) => {
  return (
    <div className="food-detection-results container mt-4">
      <ListGroup>
        {detections.map((item, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex align-items-center flex-wrap p-3"
          >
            {/* Thumbnail */}
            <div className="thumbnail-container mb-3 mb-md-0">
              <Image
                src={item.thumbnail}
                alt={item.label}
                className="thumbnail"
                rounded
              />
            </div>

            {/* Details */}
            <div className="details ms-md-3">
              <h5 className="mb-2 food-label">
                {item.label}{" "}
                <Badge bg="success" className="confidence-badge">
                  {item.confidence}
                </Badge>
              </h5>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default FoodDetectionResults;
