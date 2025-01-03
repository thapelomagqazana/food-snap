import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Spinner } from 'react-bootstrap';
import '../styles/RegistrationScreen.css';

const RegistrationScreen: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [feedback, setFeedback] = useState({
        emailValid: false,
        passwordValid: false,
        passwordsMatch: false,
    });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Field feedback
        if (name === 'email') {
            setFeedback({
                ...feedback,
                emailValid: /\S+@\S+\.\S+/.test(value),
            });
        }
        if (name === 'password') {
            setFeedback({
                ...feedback,
                passwordValid: value.length >= 8,
                passwordsMatch: value === formData.confirmPassword,
            });
        }
        if (name === 'confirmPassword') {
            setFeedback({
                ...feedback,
                passwordsMatch: value === formData.password,
            });
        }
    };

    const handleSignUp = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        if (!feedback.emailValid) {
            setError('Invalid email format.');
            setLoading(false);
            return;
        }

        if (!feedback.passwordValid) {
            setError('Password must be at least 8 characters.');
            setLoading(false);
            return;
        }

        if (!feedback.passwordsMatch) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!agreeToTerms) {
            setError('You must agree to the Terms and Conditions.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v2/auth/register`,
                {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                }
            );

            if (response.status === 201) {
                setSuccess('Registration successful! Redirecting...');
                setError('');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/onboarding');
                }, 1500);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during registration.');
            } else {
                setError('An unexpected error occurred.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <header>
                <h1>Create Your NutriSnap Account</h1>
                <p>Join the NutriSnap community and start tracking your meals effortlessly!</p>
            </header>
            <div className="form">
                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                </div>
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
                    <small className={feedback.emailValid ? 'text-success' : 'text-danger'}>
                        {feedback.emailValid ? 'Valid email' : 'Enter a valid email address'}
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
                    <small className={feedback.passwordValid ? 'text-success' : 'text-danger'}>
                        {feedback.passwordValid
                            ? 'Strong password'
                            : 'Password must be at least 8 characters'}
                    </small>
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    <small className={feedback.passwordsMatch ? 'text-success' : 'text-danger'}>
                        {feedback.passwordsMatch
                            ? 'Passwords match'
                            : 'Passwords do not match'}
                    </small>
                </div>
                <div className="terms">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={() => setAgreeToTerms(!agreeToTerms)}
                    />
                    <label htmlFor="terms">
                        I agree to the <a href="/terms" target="_blank">Terms and Conditions</a>
                    </label>
                </div>

                {/* Error Message */}
                {error && <Alert variant="danger" className="custom-alert text-center">{error}</Alert>}

                {/* Success Message */}
                {success && <Alert variant="success" className="custom-alert text-center">{success}</Alert>}

                <button onClick={handleSignUp} className="signup-button" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {' '}Signing Up...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </div>
        </div>
    );
};

export default RegistrationScreen;
