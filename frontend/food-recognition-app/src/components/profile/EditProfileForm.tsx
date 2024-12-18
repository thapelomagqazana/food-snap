import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import DietaryPreferencesDropdown from "./DietaryPreferencesDropdown";
import ProfilePictureUpload from "./ProfilePictureUpload";
import "./EditProfileForm.css";

interface EditProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialDietaryPreference?: string;
  initialProfilePicture?: string;
  onSave: (data: {
    name: string;
    preferences: string;
    profilePicture?: File | string;
  }) => Promise<void>;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialName,
  initialEmail,
  initialDietaryPreference = "",
  initialProfilePicture,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);
  const [dietaryPreference, setDietaryPreference] = useState(
    initialDietaryPreference
  );
  const [profilePicture, setProfilePicture] = useState<File | string | undefined>(
    initialProfilePicture
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await onSave({
        name,
        preferences: dietaryPreference,
        profilePicture,
      });
      setSuccessMessage("Profile updated successfully!");
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form className="edit-profile-form p-4 bg-light rounded shadow-sm">
      <h4 className="mb-3 text-center text-primary">Update Your Profile</h4>

      {/* Error/Success Alerts */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Name */}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      {/* Email (Read-only) */}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={initialEmail} disabled />
      </Form.Group>

      {/* Dietary Preferences */}
      <DietaryPreferencesDropdown
        value={dietaryPreference}
        onChange={setDietaryPreference}
      />

      {/* Profile Picture Upload */}
      <ProfilePictureUpload
        currentPicture={
          typeof profilePicture === "string" ? profilePicture : undefined
        }
        onUpload={setProfilePicture}
      />

      {/* Action Buttons */}
      <div className="text-center mt-4">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting}
          className="me-2"
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditProfileForm;