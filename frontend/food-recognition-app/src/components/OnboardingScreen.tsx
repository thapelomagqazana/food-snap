import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import '../styles/OnboardingScreen.css';

const OnboardingScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/home'); // Navigate to the Home Screen
    };

    return (
        <div className="onboarding-container">
            <header>
                <h1>Get Started with FoodTrack</h1>
            </header>
            <Carousel className="features-carousel">
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="capture-meals.jpg" // Replace with your image path
                        alt="Capture meals"
                    />
                    <Carousel.Caption>
                        <h3>Capture Meals</h3>
                        <p>Use your camera and let AI identify your meals!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="nutritional-insights.jpg" // Replace with your image path
                        alt="Nutritional insights"
                    />
                    <Carousel.Caption>
                        <h3>View Nutritional Insights</h3>
                        <p>Get detailed nutritional information in seconds.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="track-habits.jpg" // Replace with your image path
                        alt="Track eating habits"
                    />
                    <Carousel.Caption>
                        <h3>Track Eating Habits</h3>
                        <p>Monitor your habits and improve your health.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <button className="start-button" onClick={handleStart}>
                Start Using FoodTrack
            </button>
        </div>
    );
};

export default OnboardingScreen;
