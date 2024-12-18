import React from "react";
import { Button, Card } from "react-bootstrap";
import "./ImagePreview.css";

/**
 * ImagePreview Component
 * Displays a preview of a captured image and provides options to use the image or retake it.
 * 
 * Props:
 * - imageSrc: The source URL of the captured image.
 * - onUseImage: Callback function triggered when the user confirms the image.
 * - onRetake: Callback function triggered when the user decides to retake the image.
 * 
 * Features:
 * - Displays the captured image with responsive design.
 * - Provides two action buttons: "Use Image" and "Retake".
 * - Includes a title for context.
 * 
 * @returns {JSX.Element} The rendered image preview component.
 */
interface ImagePreviewProps {
  imageSrc: string;
  onUseImage: () => void;
  onRetake: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc, onUseImage, onRetake }) => {
  return (
    <div className="image-preview-container text-center">
      {/* Title */}
      <h2 className="image-preview-title">Captured Image</h2>

      {/* Card with Image and Buttons */}
      <Card className="image-preview text-center shadow-sm">
        <Card.Img variant="top" src={imageSrc} alt="Captured Food" className="preview-image" />

        <Card.Body>
          <Button  className="me-2 capture-btn" onClick={onUseImage}>
            Use Image
          </Button>
          <Button variant="secondary" onClick={onRetake}>
            Retake
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ImagePreview;
