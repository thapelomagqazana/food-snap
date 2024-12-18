import React from "react";
import { Form } from "react-bootstrap";
import "./ProfilePictureUpload.css";

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUpload: (file: File) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onUpload,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };
  const serverBaseUrl = import.meta.env.VITE_API_URL;
  const imageUrl = currentPicture
    ? `${serverBaseUrl}${currentPicture}`
    : "/default-profile.png";
  return (
    <Form.Group className="mb-3 text-center">
      <Form.Label>Profile Picture</Form.Label>
      <div>
        <img
          src={imageUrl}
          alt="Current Profile"
          className="rounded-circle mb-2"
          style={{ width: "100px", height: "100px" }}
        />
      </div>
      <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
    </Form.Group>
  );
};

export default ProfilePictureUpload;
