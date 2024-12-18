import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./CameraInterface.css";

/**
 * CameraInterface Component
 * Renders a live camera feed for capturing images.
 * - Uses the device's camera to provide a live video feed.
 * - Captures a frame from the video feed and converts it to a base64-encoded image.
 * 
 * Props:
 * - onCapture: Function to handle the captured image (base64 string).
 * - onCancel: Function to handle cancellation.
 * 
 * Features:
 * - Live video preview using `getUserMedia`.
 * - Error handling for camera access issues.
 * - Capture and cancel buttons for user interaction.
 * 
 * @returns {JSX.Element} The rendered camera interface component.
 */
interface CameraInterfaceProps {
  onCapture: (image: string) => void; // Pass captured image as a base64 string
  onCancel: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Reference to the video element
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Reference to the hidden canvas
  const [error, setError] = useState<string | null>(null); // Error state for camera access

  // Start the camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use rear camera if available
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Unable to access the camera. Please check permissions.");
      }
    };

    startCamera();

    // Cleanup camera stream on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Draw the video frame onto the canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Convert canvas to a base64-encoded image
        const imageData = canvasRef.current.toDataURL("image/png");
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="camera-interface text-center">
      <h2 className="camera-title">Capture Food Image</h2>

      {/* Error Message */}
      {error && <p className="text-danger">{error}</p>}

      {/* Live Camera View */}
      {!error && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-viewfinder mb-3"
          ></video>

          {/* Hidden Canvas for Capturing Image */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ display: "none" }} // Hidden canvas for image capture
          ></canvas>

          {/* Action Buttons */}
          <Button  size="lg" className="me-2 btn-block capture-btn" onClick={handleCapture}>
           Capture
          </Button>
          <Button variant="danger" size="lg" className="btn-block" onClick={onCancel}>
           Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default CameraInterface;
