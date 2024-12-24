import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CropTool from "../components/camera/CropTool";
import ImageControls from "../components/camera/ImageControls";
import ImageAnalysis from "../components/camera/ImageAnalysis";

const ImageAnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialImage = location.state?.image || "";
  const [image, setImage] = useState<string>(initialImage);
  const [isCropped, setIsCropped] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!initialImage) {
    navigate("/home");
    return null;
  }

  const handleCrop = (croppedImage: string) => {
    setImage(croppedImage);
    setIsCropped(true);
  };

  const handleRotate = () => {
    // Rotate the image logic
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const img = new Image();
    img.src = image;
  
    img.onload = () => {
      canvas.width = img.height; // Swap width and height for 90-degree rotation
      canvas.height = img.width;
  
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180); // Rotate 90 degrees
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        const rotatedImage = canvas.toDataURL("image/png");
        setImage(rotatedImage);
      }
    };
  };
  

  const handleReset = () => {
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
    navigate("/home");
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

