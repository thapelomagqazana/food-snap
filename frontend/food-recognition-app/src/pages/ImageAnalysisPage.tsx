import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CropTool from "../components/camera/CropTool";
import ImageControls from "../components/camera/ImageControls";
import ImageAnalysis from "../components/camera/ImageAnalysis";

const ImageAnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Always initialize state with a valid default value
  const initialImage = location.state?.image || "";

  // Hooks
  const [image, setImage] = useState<string>(initialImage);
  const [isCropped, setIsCropped] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Redirect if no image is provided
  if (!initialImage) {
    navigate("/home"); // Redirect to home
    return null;
  }

  const handleCrop = (croppedImage: string) => {
    setImage(croppedImage);
    setIsCropped(true);
  };

  const handleRotate = () => {
    // Rotate image logic
    alert("Rotate functionality not implemented.");
  };

  const handleReset = () => {
    // Reset image to original
    setImage(initialImage);
    setIsCropped(false);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = (result: any) => {
    console.log("Analysis Result:", result);
    alert("Analysis Complete! Food items identified.");
    setIsAnalyzing(false);
    navigate("/home"); // Navigate back to home after analysis
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 dashboard-btn">Image Analysis</h1>
      {!isAnalyzing && (
        <>
          <CropTool imageSrc={image} onCrop={handleCrop} />
          <ImageControls
            onRotate={handleRotate}
            onReset={handleReset}
            onAnalyze={handleAnalyze}
          />
        </>
      )}
      {isAnalyzing && (
        <ImageAnalysis image={image} onAnalysisComplete={handleAnalysisComplete} />
      )}
    </div>
  );
};

export default ImageAnalysisPage;
