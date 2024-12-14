import React from 'react';
import FormHeader from '../components/FormHeader';
import RegistrationForm from '../components/register/RegistrationForm';
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
          backgroundColor: "#f9fbe7",
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center',
          opacity: "0.8",
        }}
      >
        <FormHeader title="Create Your Account" />
        <RegistrationForm />
      </Box>
    </Box>
  );
};

export default RegistrationPage;
