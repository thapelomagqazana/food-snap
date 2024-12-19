import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CameraInterface from "../components/camera/CameraInterface";
import ImagePreview from "../components/camera/ImagePreview";
import ImageAnalysis from "../components/camera/ImageAnalysis";
import ImageUploadButton from "../components/imageUpload/ImageUploadButton";
import "./HomePage.css";

/**
 * HomePage Component
 * Provides a user-friendly interface for:
 * - Capturing food images using the camera.
 * - Previewing the captured image and choosing to analyze or retake it.
 * - Navigating back to the home screen.
 * - Analyzing food images.
 * 
 * Features:
 * - Dynamic rendering based on the current screen (home, camera, or preview).
 * - Integrates CameraInterface and ImagePreview components.
 * - Provides options to capture, use, retake, or upload an image.
 * 
 * @returns {JSX.Element} The rendered homepage component.
 */
const HomePage: React.FC = () => {
  // State to manage the current screen
  const [screen, setScreen] = useState<"home" | "camera" | "preview" | "analysis" | "upload">("home");
  // State to store the captured image data
  const [capturedImage, setCapturedImage] = useState<string>("");
  // State to store the analysis result
  const [analysisData, setAnalysisData] = useState<any | null>(null);

  // Handle capturing an image from the camera
  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData); // Save the captured image
    setScreen("preview"); // Navigate to the preview screen
  };

  // Handle using the captured image
  const handleUseImage = () => {
    setScreen("analysis"); // Navigate to the analysis screen
  };

  // Handle analysis completion
  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data); // Save analysis data
    setScreen("home"); // Navigate back to the home screen
    alert("Analysis complete!"); // Notify user (optional)
    console.log("Analysis Data:", data);
  };



  // Handle retaking the image
  const handleRetake = () => {
    setCapturedImage("");
    setScreen("camera");
  };

  return (
    <div className="home-page container text-center mt-4">
      {/* Home Screen */}
      {screen === "home" && (
        <>
          <h1 className="home-title mb-4">Welcome to FoodTrack</h1>
          <p className="home-description mb-4">
            Capture or upload a food image to analyze nutritional data.
          </p>
          <Button
            className="btn capture-btn"
            size="lg"
            onClick={() => setScreen("camera")}
          >
            Capture Food Image
          </Button>
          <Button
            className="btn upload-btn"
            size="lg"
            onClick={() => setScreen("upload")}
           >
            Upload Image
          </Button>
        </>
      )}

      {/* Camera Screen */}
      {screen === "camera" && (
        <CameraInterface onCapture={handleCapture} onCancel={() => setScreen("home")} />
      )}

      {/* Preview Screen */}
      {screen === "preview" && (
        <ImagePreview
          imageSrc={capturedImage}
          onUseImage={handleUseImage}
          onRetake={handleRetake}
        />
      )}


      {/* Analysis Screen */}
      {screen === "analysis" && (
        <ImageAnalysis
          image={capturedImage}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* Upload Screen */}
      {screen === "upload" && (
        <ImageUploadButton onImageSelect={handleCapture} />
      )}

      
    </div>
  );
};

export default HomePage;
