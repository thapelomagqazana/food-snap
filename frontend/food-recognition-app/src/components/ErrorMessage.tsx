import React from 'react';

/**
 * ErrorMessage Component
 *
 * Displays an error message if the `error` prop is provided.
 * Improves user feedback in forms or other interactive components.
 */
interface ErrorMessageProps {
  error: string; // The error message to display
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) return null;
  
    return (
      <p
        style={{
          color: 'red',
          fontSize: '0.9rem',
          margin: '0.5rem 0',
          fontWeight: 'bold',
          textAlign: 'left', // Aligns error messages with form fields
        }}
        aria-live="assertive" // Accessibility for screen readers
      >
        {error}
      </p>
    );
};
  

export default ErrorMessage;
