import React, { useState } from 'react';
import FormField from '../FormField';
import ErrorMessage from '../ErrorMessage';
import SubmitButton from '../SubmitButton';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * LoginForm Component
 *
 * A user login form with validation, error handling.
 */
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState("");

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) =>  password.length >= 8;


  const isFormValid = isEmailValid(email) && isPasswordValid(password);

  const handleSubmit = async () => {
    // Reset error and success messages
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        setSuccess("Login successful!");
        setEmail("");
        setPassword("");
      }
    } catch (apiError: any) {
      setError(
        apiError.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <form
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        background: "#f9fbe7",
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
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
      {success && (
        <p style={{ color: "green", marginBottom: "1rem" }}>{success}</p>
      )}
      <SubmitButton isFormValid={isFormValid} onClick={handleSubmit} title="Login" />
    </form>
  );
};

export default LoginForm;
