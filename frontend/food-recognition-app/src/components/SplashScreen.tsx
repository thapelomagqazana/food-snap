import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SplashScreen.css';

const SplashScreen: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/signin-signup');
        }, 4000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="splash-container">
            <div className="logo">FoodTrack</div>
            <div className="tagline">Eat Smart, Live Healthy</div>
            <div className="loading-indicator">...</div>
        </div>
    );
};

export default SplashScreen;
