import React, { useRef, useEffect } from "react";
import "./CropTool.css";

/**
 * CropTool Component
 * Provides a basic cropping tool that displays an image on a canvas
 * and allows users to crop it.
 * 
 * Props:
 * - imageSrc: Source of the image to be cropped (Base64 or data URI string).
 * - onCrop: Callback function that receives the cropped image data as a Base64 string.
 * 
 * Features:
 * - Renders the provided image on a canvas.
 * - Allows the user to crop the visible portion of the canvas.
 * 
 * @returns {JSX.Element} The rendered crop tool component.
 */
interface CropToolProps {
  imageSrc: string; // Base64 or data URI image string
  onCrop: (croppedImage: string) => void; // Callback for cropped image
}

const CropTool: React.FC<CropToolProps> = ({ imageSrc, onCrop }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const image = imageRef.current;

      // Draw the image onto the canvas once loaded
      image.onload = () => {
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear any previous drawing
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, [imageSrc]);

  const handleCrop = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const croppedData = canvas.toDataURL("image/png");
      onCrop(croppedData); // Pass the cropped image data
    }
  };

  return (
    <div className="crop-tool text-center">
      {/* Hidden image element for loading the source */}
      <img ref={imageRef} src={imageSrc} alt="To Crop" className="hidden-image" />

      {/* Canvas for displaying the image */}
      <canvas
        ref={canvasRef}
        className="crop-canvas"
        width={400}
        height={300}
      ></canvas>

      {/* Crop Button */}
      <button className="btn btn-primary mt-3 crop-button" onClick={handleCrop}>
        Apply Crop
      </button>
    </div>
  );
};

export default CropTool;
