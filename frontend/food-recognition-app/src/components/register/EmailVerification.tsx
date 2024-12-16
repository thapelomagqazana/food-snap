import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress, Button } from '@mui/material';

/**
 * EmailVerification Component
 *
 * Handles email verification by consuming a token from the URL.
 */
const EmailVerification: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage('Invalid or missing verification token.');
            return;
        }

        const verifyEmail = async () => {
            try {
                setStatus("loading");
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/verify-email`, {
                    params: { token },
                });
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
            } catch (error: any) {
                setStatus('error');
                setMessage(
                  error.response?.data?.message || 'Something went wrong. Please try again later.'
                );
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <Box
          sx={{
            textAlign: 'center',
            margin: '2rem auto',
            padding: '2rem',
            maxWidth: '400px',
            backgroundColor: "#f9fbe7",
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          {status === 'loading' && (
            <Typography variant="h6" color="textSecondary">
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Verifying your email...
            </Typography>
          )}
    
          {status === 'success' && (
            <Box sx={{ color: '#2e7d32' }}>
              <Typography variant="h5" fontWeight="bold">
                Email Verified!
              </Typography>
              <Typography sx={{ mt: 2 }}>{message}</Typography>
              <Button
                variant="contained"
                href="/login"
                sx={{ 
                    mt: 3,
                    backgroundColor: "#2e7d32", 
                    color: "white"
                }}
              >
                Go to Login
              </Button>
            </Box>
          )}
    
          {status === 'error' && (
            <Box sx={{ color: '#d32f2f' }}>
              <Typography variant="h5" fontWeight="bold">
                Email Verification Failed
              </Typography>
              <Typography sx={{ mt: 2 }}>{message}</Typography>
              <Button
                variant="contained"
                color="error"
                href="/register"
                sx={{ mt: 3 }}
              >
                Go to Registration
              </Button>
            </Box>
          )}
        </Box>
    );
};


export default EmailVerification;