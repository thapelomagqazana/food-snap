import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import CropTool from "../components/camera/CropTool";
import ImageControls from "../components/camera/ImageControls";
import ImageAnalysis from "../components/camera/ImageAnalysis";
import FoodDetectionResults from "../components/results/FoodDetectionResults";

const ImageAnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialImage = location.state?.image || "";
  const [image, setImage] = useState<string>(initialImage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [imageHeader, setImageHeader] = useState<string>("Image Analysis");

  if (!initialImage) {
    navigate("/home");
    return null;
  }

  const handleCrop = (croppedImage: string) => {
    setImage(croppedImage);
  };

  const handleRotate = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.height; 
      canvas.height = img.width;

      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        const rotatedImage = canvas.toDataURL("image/png");
        setImage(rotatedImage);
      }
    };
  };

  const handleReset = () => {
    setImage(initialImage);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResults(result);
    setIsAnalyzing(false);
    setImageHeader("Recognized Food Items");
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 dashboard-btn">{imageHeader}</h1>
      {!isAnalyzing && !analysisResults && (
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
      {analysisResults?.detections?.length === 0 && (
        <div className="text-center mt-4">
          <p>The model used doesn't recognize any food items in the image. Please try another image.</p>
          <Button className="capture-btn" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      )}
      {analysisResults && analysisResults.detections?.length > 0 && (
        <FoodDetectionResults detections={analysisResults.detections} />
      )}
    </div>
  );
};

export default ImageAnalysisPage;
