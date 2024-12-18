import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import CameraInterface from "../components/camera/CameraInterface";
import ImagePreview from "../components/camera/ImagePreview";
import "./HomePage.css";

/**
 * HomePage Component
 * Provides a user-friendly interface for:
 * - Capturing food images using the camera.
 * - Previewing the captured image and choosing to analyze or retake it.
 * - Navigating back to the home screen.
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
  const [screen, setScreen] = useState<"home" | "camera" | "preview">("home");
  // State to store the captured image data
  const [capturedImage, setCapturedImage] = useState<string>("");

  // Handle capturing an image from the camera
  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData); // Save the captured image
    setScreen("preview"); // Navigate to the preview screen
  };

  // Handle using the captured image
  const handleUseImage = () => {
    alert("Analyzing your food..."); // Replace with navigation to analysis page
    console.log("Proceed to Image Analysis Page");
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
    </div>
  );
};

export default HomePage;
