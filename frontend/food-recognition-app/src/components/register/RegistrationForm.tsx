import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import PasswordInput from "../PasswordInput";
import "./RegistrationForm.css";

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ 
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    apiError: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Inline validation
    if (name === "email") {
        setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Invalid email format.",
        });
    }
      
    if (name === "password") {
        setErrors({
          ...errors,
          password: validatePassword(value)
            ? ""
            : "Password must be at least 8 characters, include 1 uppercase letter and 1 number.",
          confirmPassword:
            value !== formData.confirmPassword ? "Passwords do not match." : "",
        });
    }

    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          value !== formData.password ? "Passwords do not match." : "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ ...errors, apiError: "" });
    setSuccessMessage("");
    setLoading(true);

    // Final validation before submission
    if (
        !formData.name ||
        !validateEmail(formData.email) ||
        !validatePassword(formData.password) ||
        formData.password !== formData.confirmPassword
    ) {
        setErrors({
        ...errors,
        apiError: "Please fill out all fields correctly.",
        });
        setLoading(false);
        return;
    }

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
  
        if (response.status === 201) {
          setSuccessMessage(response?.data?.message || "Registration successful! Please verify your email.");
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setErrors({
          ...errors,
          apiError:
            axiosError.response?.data?.message || "Registration failed. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="registration-form p-4 bg-white rounded shadow">
      <h2 className="text-center text-primary mb-4">Create Your Account</h2>

      {errors.apiError && <Alert variant="danger">{errors.apiError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Name */}
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Password */}
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter a secure password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
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
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default RegistrationForm;
