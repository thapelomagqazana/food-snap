import React from "react";
import { Button } from "react-bootstrap";
import "./ImageControls.css";

interface ImageControlsProps {
  onRotate: () => void;
  onReset: () => void;
  onAnalyze: () => void;
}

const ImageControls: React.FC<ImageControlsProps> = ({
  onRotate,
  onReset,
  onAnalyze,
}) => {
  return (
    <div className="image-controls mt-4">
      <Button variant="secondary" className="control-button me-2" onClick={onRotate}>
        Rotate
      </Button>
      <Button variant="warning" className="control-button me-2" onClick={onReset}>
        Reset
      </Button>
      <Button variant="success" className="control-button" onClick={onAnalyze}>
        Analyze
      </Button>
    </div>
  );
};

export default ImageControls;
