import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/BottomNav.css'; // Optional: Add specific styles for the navbar

const BottomNav: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <Navbar fixed="bottom" bg="light" className="bottom-nav">
            <Nav className="w-100 justify-content-around">
                <Nav.Item>
                    <Nav.Link onClick={() => handleNavigation('/home')}>
                        <i className="bi bi-house-fill"></i>
                        <span>Home</span>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => handleNavigation('/daily-logs')}>
                        <i className="bi bi-list-check"></i>
                        <span>Logs</span>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={() => handleNavigation('/profile')}>
                        <i className="bi bi-person-circle"></i>
                        <span>Profile</span>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default BottomNav;
