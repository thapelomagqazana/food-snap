import React from "react";
import { Form } from "react-bootstrap";
import "./DietaryPreferencesDropdown.css";

/**
 * DietaryPreferencesDropdown Component
 * A dropdown component that allows users to select multiple dietary preferences.
 * 
 * Props:
 * - values: Array of currently selected preferences.
 * - onChange: Function to handle changes in the selected preferences.
 * 
 * Features:
 * - Displays a list of predefined dietary preferences.
 * - Supports multiple selection with visual feedback.
 * - Responsive design for various screen sizes.
 * 
 * @returns {JSX.Element} The rendered dietary preferences dropdown component.
 */
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
    onChange(selectedOptions); // Update the selected preferences
  };

  return (
    <Form.Group className="dietary-preferences-dropdown mb-3">
      <Form.Label>Dietary Preferences</Form.Label>
      <Form.Select
        multiple
        value={values}
        onChange={handleSelectionChange}
        className="preferences-select"
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
