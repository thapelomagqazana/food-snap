import React from "react";
import { Form } from "react-bootstrap";
import "./DietaryPreferencesDropdown.css";

interface DietaryPreferencesDropdownProps {
  values: string[]; // Array of selected preferences
  onChange: (values: string[]) => void; // Function to handle changes
}

const DietaryPreferencesDropdown: React.FC<DietaryPreferencesDropdownProps> = ({
  values,
  onChange,
}) => {
  const preferences = ["Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free"];

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    onChange(selectedOptions);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Dietary Preferences</Form.Label>
      <Form.Select
        multiple
        value={values}
        onChange={handleSelectionChange}
        style={{ height: "150px" }}
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
