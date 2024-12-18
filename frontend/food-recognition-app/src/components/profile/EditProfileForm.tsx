import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import DietaryPreferencesDropdown from "./DietaryPreferencesDropdown";
import ProfilePictureUpload from "./ProfilePictureUpload";
import "./EditProfileForm.css";

/**
 * EditProfileForm Component
 * Renders a form to update the user's profile, including:
 * - Name, dietary preferences, and profile picture.
 * - Displays error and success messages upon saving.
 * 
 * Props:
 * - initialName: Initial value for the name field.
 * - initialEmail: Initial email (read-only).
 * - initialDietaryPreferences: Initial array of dietary preferences.
 * - initialProfilePicture: URL or path to the initial profile picture (optional).
 * - onSave: Function to handle saving the form data (async).
 * - onCancel: Function triggered when the Cancel button is clicked.
 * 
 * Features:
 * - Includes validation for required fields.
 * - Spinner and disabled state during form submission.
 * - Responsive design for optimal display on all devices.
 * 
 * @returns {JSX.Element} The rendered edit profile form.
 */
interface EditProfileFormProps {
  initialName: string;
  initialEmail: string;
  initialDietaryPreferences: string[];
  initialProfilePicture?: string;
  onSave: (data: {
    name: string;
    preferences: string[];
    profilePicture?: File | string;
  }) => Promise<void>;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialName,
  initialEmail,
  initialDietaryPreferences,
  initialProfilePicture,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(initialDietaryPreferences);
  const [profilePicture, setProfilePicture] = useState<File | string | undefined>(initialProfilePicture);
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
        preferences: dietaryPreferences,
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
      <h4 className="mb-3 text-center">Update Your Profile</h4>

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
      <DietaryPreferencesDropdown values={dietaryPreferences} onChange={setDietaryPreferences} />

      {/* Profile Picture Upload */}
      <ProfilePictureUpload
        currentPicture={typeof profilePicture === "string" ? profilePicture : undefined}
        onUpload={setProfilePicture}
      />

      {/* Action Buttons */}
      <div className="text-center mt-4">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting}
          className="me-2 edit-btn"
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
