import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/SplashScreen.css';

const SplashScreen: React.FC = () => {
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigate('/signin-signup');
    //     }, 5000);
    //     return () => clearTimeout(timer);
    // }, [navigate]);

    return (
        <div className="splash-container">
            <header className="logo">NutriSnap</header>
            <p className="tagline">Eat Smart, Live Healthy</p>
            <div className="loading-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <Button
                variant="outline-light"
                className="skip-button"
                onClick={() => navigate('/signin-signup')}
            >
                Skip
            </Button>
        </div>

    );
};

export default SplashScreen;
