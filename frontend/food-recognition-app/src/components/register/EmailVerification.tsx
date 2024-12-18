import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner, Alert, Button, Container } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import "./EmailVerification.css";

/**
 * EmailVerification Component
 * Handles the email verification process based on a token received via URL parameters.
 * 
 * Features:
 * - Displays a loading state while verifying the email.
 * - Shows a success message and a call-to-action if the verification is successful.
 * - Displays an error message with appropriate actions if the verification fails.
 * 
 * @returns {JSX.Element} The rendered email verification component.
 */
const EmailVerification: React.FC = () => {
  // React Router hook to access URL parameters
  const [searchParams] = useSearchParams();
  // State to track verification status: loading, success, or error
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  // Message to display based on the verification outcome
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token"); // Get the token from URL parameters

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    // Function to verify the email using the token
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/verify-email`, {
          params: { token },
        });

        setStatus("success");
        setMessage(response.data.message || "Your email has been successfully verified!");
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        setStatus("error");
        setMessage(
          axiosError.response?.data?.message || "Verification failed. Please try again later."
        );
      }
    };

    verifyEmail(); // Call the email verification function
  }, [searchParams]);

  return (
    <Container className="email-verification-container">
      <div className="verification-content text-center">
        {/* Loading State */}
        {status === "loading" && (
          <div className="loading-state">
            <Spinner animation="border" role="status" className="mb-3" />
            <h3>Verifying your email...</h3>
            <p>Please wait a moment.</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <Alert variant="success" className="py-4">
            <h3>Email Verified!</h3>
            <p>{message}</p>
            <Button variant="primary" href="/login" className="mt-3">
              Go to Login
            </Button>
          </Alert>
        )}

        {/* Error State */}
        {status === "error" && (
          <Alert variant="danger" className="py-4">
            <h3>Verification Failed</h3>
            <p>{message}</p>
            <Button variant="secondary" href="/register" className="mt-3">
              Go to Registration
            </Button>
          </Alert>
        )}
      </div>
    </Container>
  );
};

export default EmailVerification;
