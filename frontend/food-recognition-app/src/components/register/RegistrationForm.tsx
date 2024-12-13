import React, { useState } from 'react';
import FormField from '../FormField';
import ErrorMessage from '../ErrorMessage';
import SubmitButton from './SubmitButton';

/**
 * RegistrationForm Component
 *
 * A user registration form with validation, error handling, and enhanced UX.
 */
const RegistrationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isFormValid = !!name && !!email && password.length >= 8;

  const handleSubmit = () => {
    if (email === 'test@example.com') {
      setError('Email is already registered');
    } else {
      alert('Registration successful! Please log in.');
      setError(''); // Clear errors on success
    }
  };

  return (
    <form
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        background: '#f9f9f9',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <FormField
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormField
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField
        type="password"
        placeholder="Enter a secure password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <small style={{ fontSize: "0.9rem", color: "#888", display: "block", marginBottom: "1rem" }}>
        Password must be at least 8 characters long
      </small>
      <ErrorMessage error={error} />
      <SubmitButton isFormValid={isFormValid} onClick={handleSubmit} />
    </form>
  );
};

export default RegistrationForm;
