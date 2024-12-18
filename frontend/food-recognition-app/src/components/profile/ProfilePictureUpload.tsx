import React from "react";
import { Form } from "react-bootstrap";
import "./ProfilePictureUpload.css";

/**
 * ProfilePictureUpload Component
 * Allows users to view and update their profile picture.
 * 
 * Props:
 * - currentPicture: URL or path to the current profile picture (optional).
 * - onUpload: Function to handle the uploaded file.
 * 
 * Features:
 * - Displays the current profile picture with a default fallback.
 * - Provides a file input to upload a new profile picture.
 * - Responsive design for various screen sizes.
 * 
 * @returns {JSX.Element} The rendered profile picture upload component.
 */
interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUpload: (file: File) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onUpload,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      onUpload(file); // Trigger the onUpload callback
    }
  };

  const serverBaseUrl = import.meta.env.VITE_API_URL;
  const imageUrl = currentPicture
    ? `${serverBaseUrl}${currentPicture}`
    : "/default-profile.png"; // Fallback to default profile picture

  return (
    <Form.Group className="profile-picture-upload mb-3 text-center">
      <Form.Label>Profile Picture</Form.Label>
      <div className="profile-picture-container mb-2">
        <img
          src={imageUrl}
          alt="Current Profile"
          className="profile-picture rounded-circle"
        />
      </div>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="upload-input"
      />
    </Form.Group>
  );
};

export default ProfilePictureUpload;
