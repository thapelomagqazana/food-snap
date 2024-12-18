import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Profile.css";

interface ProfileProps {
  name: string;
  email: string;
  dietaryPreference?: string;
  profilePicture?: string;
  onEdit: () => void; // Action to trigger Edit Mode
}

const Profile: React.FC<ProfileProps> = ({
  name,
  email,
  dietaryPreference = "Not Set",
  profilePicture,
  onEdit,
}) => {
  const serverBaseUrl = import.meta.env.VITE_API_URL;
  const imageUrl = profilePicture
    ? `${serverBaseUrl}${profilePicture}`
    : "/default-profile.png";

  return (
    <Card className="profile-page shadow-sm">
      <Card.Header className="bg-secondary text-white text-center">
        <h4>My Profile</h4>
      </Card.Header>
      <Card.Body className="text-center">
        {/* Profile Picture */}
        <div className="profile-picture-container mb-3">
          <img
            src={imageUrl}
            alt="Profile"
            className="profile-picture rounded-circle"
          />
        </div>

        {/* Profile Details */}
        <div className="mb-3">
          <strong>Name:</strong> <span>{name}</span>
        </div>
        <div className="mb-3">
          <strong>Email:</strong> <span>{email}</span>
        </div>
        <div className="mb-3">
          <strong>Dietary Preference:</strong>{" "}
          <span>{dietaryPreference}</span>
        </div>

        {/* Edit Profile Button */}
        <Button variant="primary" onClick={onEdit}>
          Edit Profile
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Profile;
