import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "./Profile.css";

/**
 * Profile Component
 * Displays the user's profile information, including:
 * - Name, email, profile picture, and dietary preferences.
 * - Option to edit the profile via an Edit button.
 * 
 * Props:
 * - name: User's name.
 * - email: User's email address.
 * - dietaryPreference: Array of user's dietary preferences (optional).
 * - profilePicture: URL or path to the user's profile picture (optional).
 * - onEdit: Function triggered when the Edit button is clicked.
 * 
 * Features:
 * - Displays a default profile picture if none is provided.
 * - Styled badges for dietary preferences.
 * - Responsive design for optimal display on all devices.
 * 
 * @returns {JSX.Element} The rendered profile component.
 */
interface ProfileProps {
  name: string;
  email: string;
  dietaryPreference?: string[];
  profilePicture?: string;
  onEdit: () => void; // Action to trigger Edit Mode
}

const Profile: React.FC<ProfileProps> = ({
  name,
  email,
  dietaryPreference = [],
  profilePicture,
  onEdit,
}) => {
  const serverBaseUrl = import.meta.env.VITE_API_URL;
  const imageUrl = profilePicture
    ? `${serverBaseUrl}${profilePicture}`
    : "/default-profile.png"; // Fallback to default profile picture

  return (
    <Card className="profile-page shadow-sm">
      {/* Header Section */}
      <Card.Header className="profile-header text-white text-center">
        <h4>My Profile</h4>
      </Card.Header>

      {/* Profile Content */}
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
          <strong>Dietary Preferences:</strong>
          <div className="dietary-preferences mt-2">
            {dietaryPreference.length > 0 ? (
              dietaryPreference.map((preference, index) => (
                <Badge key={index} bg="info" className="me-1">
                  {preference}
                </Badge>
              ))
            ) : (
              <span>Not Set</span>
            )}
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button className="edit-btn" onClick={onEdit}>
          Edit Profile
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Profile;
