import React from "react";
import { Form } from "react-bootstrap";
import "./DietaryPreferencesDropdown.css";

interface DietaryPreferencesDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const DietaryPreferencesDropdown: React.FC<DietaryPreferencesDropdownProps> = ({
  value,
  onChange,
}) => {
  const preferences = ["None", "Vegetarian", "Vegan", "Keto", "Paleo"];

  return (
    <Form.Group className="mb-3">
      <Form.Label>Dietary Preferences</Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {preferences.map((pref) => (
          <option key={pref} value={pref}>
            {pref}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default DietaryPreferencesDropdown;
