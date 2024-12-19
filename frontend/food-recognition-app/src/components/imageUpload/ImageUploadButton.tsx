import React from "react";
import { Form } from "react-bootstrap";
import "./ImageUploadButton.css";

/**
 * ImageUploadButton Component
 * A file upload button for selecting images and converting them to Base64.
 * 
 * Props:
 * - onImageSelect: Callback function that receives the selected image data as a Base64 string.
 * 
 * Features:
 * - Converts the uploaded image to Base64 for easy usage.
 * - Displays a clear and accessible file input field.
 * - Responsive design for seamless use across devices.
 * 
 * @returns {JSX.Element} The rendered image upload button component.
 */
interface ImageUploadButtonProps {
  onImageSelect: (imageData: string) => void; // Callback for selected image data
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onImageSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          onImageSelect(reader.result); // Pass base64 data to the parent
        }
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  return (
    <Form.Group controlId="formFile" className="image-upload-button mb-3">
      <Form.Label>Upload an Image</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="upload-input"
      />
    </Form.Group>
  );
};

export default ImageUploadButton;
