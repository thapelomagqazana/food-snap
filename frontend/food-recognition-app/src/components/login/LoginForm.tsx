import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import PasswordInput from "../PasswordInput";
import axios, { AxiosError } from "axios";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
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
        // Optionally, redirect to Dashboard after login
        setTimeout(() => {
          window.location.href = "/dashboard";
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
      <h2 className="text-center text-primary mb-4">Welcome Back!</h2>

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
          variant="primary"
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
