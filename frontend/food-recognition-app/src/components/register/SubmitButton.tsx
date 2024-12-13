import React from 'react';

/**
 * SubmitButton Component
 *
 * A reusable button for form submission with dynamic styles based on validity.
 */
interface SubmitButtonProps {
  isFormValid: boolean; // Indicates whether the form is valid
  onClick: () => void; // Event handler for button click
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isFormValid, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isFormValid}
      style={{
        padding: '1rem',
        backgroundColor: isFormValid ? '#4caf50' : '#ccc', // Dynamic background color
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        cursor: isFormValid ? 'pointer' : 'not-allowed',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease-in-out',
      }}
    >
      Register
    </button>
  );
};

export default SubmitButton;
