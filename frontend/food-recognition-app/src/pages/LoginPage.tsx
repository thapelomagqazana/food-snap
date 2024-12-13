import React from 'react';
import FormHeader from '../components/FormHeader';
import LoginForm from '../components/login/LoginForm';
import { Box } from '@mui/material';

const RegistrationPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <FormHeader title="Welcome Back!" />
        <LoginForm />
      </Box>
    </Box>
  );
};

export default RegistrationPage;
