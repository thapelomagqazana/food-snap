import React from "react";
import { Button } from "react-bootstrap";
import "./ImageControls.css";

/**
 * ImageControls Component
 * Provides controls for manipulating an image, including:
 * - Rotate, reset, and analyze actions.
 * 
 * Props:
 * - onRotate: Function triggered when the Rotate button is clicked.
 * - onReset: Function triggered when the Reset button is clicked.
 * - onAnalyze: Function triggered when the Analyze button is clicked.
 * 
 * Features:
 * - Displays a row of buttons for controlling the image.
 * - Responsive design for seamless use across devices.
 * 
 * @returns {JSX.Element} The rendered image controls component.
 */
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
      {/* Rotate Button */}
      <Button variant="secondary" className="control-button me-2" onClick={onRotate}>
        Rotate
      </Button>

      {/* Reset Button */}
      <Button variant="warning" className="control-button me-2" onClick={onReset}>
        Reset
      </Button>

      {/* Analyze Button */}
      <Button variant="success" className="control-button" onClick={onAnalyze}>
        Analyze
      </Button>
    </div>
  );
};

export default ImageControls;
