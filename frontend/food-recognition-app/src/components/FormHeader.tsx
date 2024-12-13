import React from "react";

interface HeaderProps {
  title: string; // Prop to define the header text
}

/**
 * FormHeader Component
 *
 * Displays a customizable header with a given title.
 *
 * Props:
 * - `title` (string): The text to display as the header.
 *
 * Example Usage:
 * ```tsx
 * <Header title="Create Your Account" />
 * ```
 */
const FormHeader: React.FC<HeaderProps> = ({ title }) => {
  return (
    <h1
      style={{
        textAlign: 'center',
        color: '#2e7d32', // Green color to align with the theme
        fontSize: '2rem',
        marginBottom: '1.5rem',
        fontWeight: 'bold',
      }}
    >
      {title}
    </h1>
  );
};

export default FormHeader;