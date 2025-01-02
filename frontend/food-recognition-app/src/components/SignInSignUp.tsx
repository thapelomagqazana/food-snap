import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignInSignUp.css';

const SignInSignUp: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignIn = async () => {
        setError('');
        setSuccess('');

        // Input validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Invalid email format');
            return;
        }

        try {
            // API request
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v2/auth/login`, {
                email: formData.email,
                password: formData.password,
            });

            // Success handling
            if (response.status === 200) {
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/home'); // Navigate to the Home Screen after success
                }, 1500);
            }
        } catch (err: unknown) {
            // Type guard for error object
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during login.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    const handleSignUp = () => {
        navigate('/register'); // Navigate to the Registration Screen
    };

    return (
        <div className="signin-signup-container">
            <header>
                <h1>Welcome to FoodSnap</h1>
                <p>Track your meals effortlessly with AI-powered insights.</p>
            </header>
            <div className="signin-section">
                <h2>Sign In</h2>
                <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button onClick={handleSignIn} className="signin-button">Sign In</button>
                <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <div className="signup-section">
                <p>Don't have an account?</p>
                <button onClick={handleSignUp} className="signup-button">Create Account</button>
            </div>
        </div>
    );
};

export default SignInSignUp;
