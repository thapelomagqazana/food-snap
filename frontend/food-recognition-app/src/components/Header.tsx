import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="container">
        {isAuthenticated ? (
          // Show NavigationBar when logged in
          <Navbar bg="light" expand="lg" className="shadow-sm">
            <Navbar.Brand href="/" className="text-primary fw-bold">
              FoodTrack
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/" className="me-3">
                  Home
                </Nav.Link>
                <Nav.Link href="/dashboard" className="me-3">
                  Dashboard
                </Nav.Link>
                <Nav.Link href="/profile" className="me-3">
                  Profile
                </Nav.Link>
                <Button variant="danger" onClick={logout}>
                  Log Out
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        ) : (
          // Default header content when not logged in
          <div className="d-flex justify-content-center align-items-center">
            <a href="/" aria-label="Navigate to Home">
              <img
                src="/logo.png" // Replace with your actual logo
                alt="FoodTrack Logo"
                className="app-logo"
              />
            </a>
            <div className="app-tagline ms-3">Your Nutrition Buddy</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
