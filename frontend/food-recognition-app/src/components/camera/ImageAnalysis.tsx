import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import "./ImageAnalysis.css";

/**
 * ImageAnalysis Component
 * Simulates and displays a food image analysis process.
 * 
 * Props:
 * - image: Base64 string representing the uploaded or captured image.
 * - onAnalysisComplete: Callback function triggered when the analysis is complete.
 * 
 * Features:
 * - Displays the uploaded image during analysis.
 * - Shows a spinner and progress text while the analysis is ongoing.
 * - Simulates a delay before invoking the analysis complete callback.
 * 
 * @returns {JSX.Element} The rendered image analysis component.
 */
interface ImageAnalysisProps {
  image: string; // Base64 image string
  onAnalysisComplete: (data: any) => void; // Callback with analysis result
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ image, onAnalysisComplete }) => {
  useEffect(() => {
    // Simulate a delay for analysis
    const analyzeImage = async () => {
      // Replace with actual API call for image analysis
      setTimeout(() => {
        const fakeAnalysisData = { nutrition: "Sample Nutrition Data" };
        onAnalysisComplete(fakeAnalysisData);
      }, 3000); // Simulate a 3-second delay
    };

    analyzeImage();
  }, [image, onAnalysisComplete]);

  return (
    <div className="image-analysis text-center">
      {/* Display the image being analyzed */}
      <img
        src={image}
        alt="Analyzing Food"
        className="analysis-image rounded shadow-sm mb-3"
      />

      {/* Loading Spinner and Message */}
      <div className="analysis-status">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Analyzing your food...</span>
      </div>
    </div>
  );
};

export default ImageAnalysis;
