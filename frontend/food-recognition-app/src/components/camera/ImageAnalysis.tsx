import React, { useState } from "react";
import { Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const analyzeImage = async () => {
      try {
        setErrorMessage(null);
        // console.log("Cropped Image Data:", image);
        // Extract the Base64 data
        const base64Data = image.split(",")[1]; // Remove the "data:image/...;base64," prefix

        // Convert Base64 to Blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" }); // Replace with actual MIME type of the image

        // Create FormData and append the Blob
        const formData = new FormData();
        formData.append("image", blob, "captured-image.png"); // Provide a file name for the Blob

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/classify/image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // console.log(response);

        onAnalysisComplete(response.data);
      } catch (error: any) {
        console.error("Image analysis failed:", error.message);
        setErrorMessage("Failed to analyze the image. Please try again.");
      }
    };

    analyzeImage();
  }, [image, onAnalysisComplete]);

  return (
    <div className="image-analysis text-center">
      {/* Display the image being analyzed */}
      <img src={image} alt="Analyzing" className="analysis-image img-fluid mb-3" />

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}

      {/* Spinner and Progress Message */}
      <div className="analysis-status">
        <Spinner animation="border" role="status" className="me-2 spinner" />
        <span>Analyzing your image... Please wait.</span>
      </div>
      <Button variant="secondary" className="mt-3" onClick={() => window.history.back()}>
        Cancel
      </Button>
    </div>
  );
};

export default ImageAnalysis;
