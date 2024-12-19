import React from "react";
import { Spinner } from "react-bootstrap";
import "./ImageAnalysis.css";

/**
 * ImageAnalysis Component
 * Simulates the analysis of a food image and returns a sample result.
 * 
 * Props:
 * - image: Base64 string representing the image to be analyzed.
 * - onAnalysisComplete: Callback function that receives the analysis result.
 * 
 * Features:
 * - Displays the provided image during the analysis process.
 * - Shows a spinner and message while the analysis is in progress.
 * - Simulates a delay to mimic real-world API behavior.
 * 
 * @returns {JSX.Element} The rendered image analysis component.
 */
interface ImageAnalysisProps {
  image: string; // Base64 image string
  onAnalysisComplete: (result: any) => void; // Callback for analysis result
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({
  image,
  onAnalysisComplete,
}) => {
  React.useEffect(() => {
    // Simulate analysis delay
    const timer = setTimeout(() => {
      onAnalysisComplete({ nutrition: "Sample Nutrition Data" });
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [image, onAnalysisComplete]);

  return (
    <div className="image-analysis text-center">
      {/* Display the image being analyzed */}
      <img src={image} alt="Analyzing" className="analysis-image img-fluid mb-3" />

      {/* Spinner and Progress Message */}
      <div className="analysis-status">
        <Spinner animation="border" role="status" className="me-2 spinner" />
        <span>Analyzing your food...</span>
      </div>
    </div>
  );
};

export default ImageAnalysis;
