import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import PasswordInput from "../utils/PasswordInput";
import { AxiosError } from "axios";
import axios from "../../axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

/**
 * LoginForm Component
 * Renders a login form that:
 * - Accepts user email and password.
 * - Provides inline validation for the email field.
 * - Displays success or error messages based on API responses.
 * - Redirects the user upon successful login.
 *
 * Features:
 * - Loading spinner while the login request is processing.
 * - Inline error feedback for invalid email format.
 * - Forgot password link for recovery.
 *
 * @returns {JSX.Element} The rendered login form component.
 */
const LoginForm: React.FC = () => {
  const { login } = useAuth(); // Authentication context for login functionality
  const navigate = useNavigate(); // Navigation hook
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", apiError: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Email validation function
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Inline validation for email
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email format." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ ...errors, apiError: "" });
    setSuccessMessage("");
    setLoading(true);

    if (!validateEmail(formData.email) || !formData.password) {
      setErrors({
        ...errors,
        apiError: "Please fill out all fields correctly.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        setSuccessMessage("Login successful! Redirecting...");
        // Redirect to home page after login
        setTimeout(() => {
          login(response.data.token); // Store token and handle expiration
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setErrors({
        ...errors,
        apiError: axiosError.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form p-4 bg-white rounded shadow">
      <h2 className="text-center mb-4">Welcome Back!</h2>

      {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Email Field */}
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            required
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        {/* Password Field */}
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Submit Button */}
        <Button
          variant="success"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center mt-3">
          <a href="/forgot-password" className="text-muted">
            Forgot Password?
          </a>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
