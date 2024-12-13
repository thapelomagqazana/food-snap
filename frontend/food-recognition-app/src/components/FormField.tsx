import React from "react";

/**
 * FormField Component
 *
 * Renders a reusable form input field with consistent styling and accessibility.
 */
interface FormFieldProps {
    type: string; // Input type (e.g., text, email, password)
    placeholder: string; // Placeholder text for the input field
    value: string; // Current value of the input field
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Event handler for input changes
  }
  

  const FormField: React.FC<FormFieldProps> = ({ type, placeholder, value, onChange }) => {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'border-color 0.3s ease-in-out',
          }}
          onFocus={(e) => e.target.style.borderColor = '#4caf50'} // Green border on focus
          onBlur={(e) => e.target.style.borderColor = '#ccc'} // Default border on blur
          aria-label={placeholder} // Accessibility
        />
      </div>
    );
  };
  
  export default FormField;