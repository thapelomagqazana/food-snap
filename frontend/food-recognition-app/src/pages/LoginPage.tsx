import React from 'react';
import LoginForm from '../components/login/LoginForm';
import { Container } from "react-bootstrap";

const LoginPage: React.FC = () => {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
