import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from 'react-bootstrap';
import '../styles/SignInSignUp.css';

const SignInSignUp: React.FC = () => {
    const { login } = useAuth(); // Authentication context for login functionality
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            setEmailValid(/\S+@\S+\.\S+/.test(value));
        }
    };

    const handleSignIn = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        // Input validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required.');
            setLoading(false);
            return;
        }

        if (!emailValid) {
            setError('Invalid email format.');
            setLoading(false);
            return;
        }

        try {
            // API request
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v2/auth/login`, {
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200) {
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    setLoading(false);
                    login(response.data.token); // Store token and handle expiration
                    navigate('/home');
                }, 1500);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during login.');
            } else {
                setError('An unexpected error occurred.');
            }
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    return (
        <div className="signin-signup-container">
            <header>
                <h1>Welcome to FoodTrack</h1>
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
                    <small className={emailValid ? 'text-success' : 'text-danger'}>
                        {emailValid ? 'Valid email address' : 'Invalid email address'}
                    </small>
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-field">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                {error && <Alert variant="danger" className="custom-alert text-center">{error}</Alert>}
                {success && <Alert variant="success" className="custom-alert text-center">{success}</Alert>}
                <button onClick={handleSignIn} className="signin-button" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {' '}Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
                <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <div className="signup-section">
                <p>Don't have an account?</p>
                <button onClick={handleSignUp} className="signup-button-1">Create Account</button>
            </div>
        </div>
    );
};

export default SignInSignUp;
