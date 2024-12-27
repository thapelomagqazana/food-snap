import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

/**
 * Header Component
 * Renders the application header with navigation links and logo.
 * - If the user is authenticated, it displays a navigation bar with links and a logout button.
 * - If not authenticated, it displays the app logo and tagline.
 * 
 * @returns {JSX.Element} The rendered header component.
 */
const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth(); // Fetch authentication status and logout function

  return (
    <header className="app-header">
      <div className="container">
        {isAuthenticated ? (
          // Display navigation bar when the user is logged in
          <Navbar bg="light" expand="lg" className="shadow-sm">
            <Navbar.Brand href="/" className="fw-bold">
              {/* App Logo / Brand */}
              FoodTrack
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {/* Navigation Links */}
                <Nav.Link href="/home" className="me-3">
                  Home
                </Nav.Link>
                {/* <Nav.Link href="/dashboard" className="me-3">
                  Dashboard
                </Nav.Link> */}
                <Nav.Link href="/profile" className="me-3">
                  Profile
                </Nav.Link>
                {/* Logout Button */}
                <Button variant="danger" onClick={logout}>
                  Log Out
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        ) : (
          // Display logo and tagline for unauthenticated users
          <div className="d-flex justify-content-center align-items-center">
            <a href="/" aria-label="Navigate to Home">
              {/* App Logo */}
              <img
                src="/foodTrack.webp" // Replace with actual logo file path
                alt="FoodTrack Logo"
                className="app-logo"
              />
            </a>
            {/* Tagline */}
            <div className="app-tagline ms-3">Your Nutrition Buddy</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
