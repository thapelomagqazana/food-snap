import React from "react";
import { Card, Button } from "react-bootstrap";
import "./ProfileSummary.css";

interface ProfileSummaryProps {
  name: string;
  email: string;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ name, email }) => {
  return (
    <Card className="profile-summary shadow-sm mb-4">
      <Card.Header className="bg-secondary text-white text-center">
        <h4>Your Profile</h4>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <strong>Name:</strong> <span>{name}</span>
        </div>
        <div className="mb-3">
          <strong>Email:</strong> <span>{email}</span>
        </div>
        <div className="text-center">
          <Button variant="primary" href="/profile/edit">
            Edit Profile
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileSummary;
