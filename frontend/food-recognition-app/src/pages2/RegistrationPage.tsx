import React from "react";
import RegistrationForm from "../components/register/RegistrationForm";
import { Container } from "react-bootstrap";

const RegistrationPage: React.FC = () => {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <RegistrationForm />
    </Container>
  );
};

export default RegistrationPage;
