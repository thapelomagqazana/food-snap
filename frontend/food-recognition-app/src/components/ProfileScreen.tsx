import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import '../styles/ProfileScreen.css';
import BottomNav from './BottomNav';

interface UserProfile {
    name: string;
    email: string;
    dietaryRestrictions: string;
    notificationsEnabled: boolean;
}

const ProfileScreen: React.FC = () => {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        dietaryRestrictions: '',
        notificationsEnabled: true,
    });
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v2/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile. Please try again later.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            await axios.put(`${import.meta.env.VITE_API_URL}/api/v2/auth/profile`, profile, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            setEditMode(false);
            setLoading(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to save changes. Please try again.');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className="profile-container">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <header>
                <h1>Your Profile</h1>
            </header>
            <Card className="profile-card">
                <Card.Body>
                    <Form>
                        <Form.Group controlId="profileName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </Form.Group>

                        <Form.Group controlId="profileEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group controlId="profileDietaryRestrictions" className="mt-3">
                            <Form.Label>Dietary Restrictions</Form.Label>
                            <Form.Control
                                type="text"
                                name="dietaryRestrictions"
                                value={profile.dietaryRestrictions}
                                onChange={handleInputChange}
                                disabled={!editMode}
                                placeholder="E.g., Vegetarian, Vegan, Gluten-Free"
                            />
                        </Form.Group>

                        <Form.Group controlId="profileNotifications" className="mt-3">
                            <Form.Check
                                type="checkbox"
                                name="notificationsEnabled"
                                checked={profile.notificationsEnabled}
                                onChange={handleInputChange}
                                label="Enable Notifications"
                                disabled={!editMode}
                            />
                        </Form.Group>
                    </Form>

                    <div className="action-buttons mt-4">
                        {editMode ? (
                            <Button variant="success" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleEditToggle}>
                                Edit Profile
                            </Button>
                        )}
                        <Button variant="danger" onClick={() => setShowLogoutConfirm(true)}>
                            Log Out
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <BottomNav />

            {/* Logout Confirmation Modal */}
            <Modal show={showLogoutConfirm} onHide={() => setShowLogoutConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to log out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        Log Out
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfileScreen;
