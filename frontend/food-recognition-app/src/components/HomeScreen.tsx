import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav, Modal, Button } from 'react-bootstrap';
import '../styles/HomeScreen.css';

const HomeScreen: React.FC = () => {
    const [userName, setUserName] = useState<string>(''); // Dynamically set user's name
    const [timeOfDay, setTimeOfDay] = useState<string>('');
    const [cameraModalVisible, setCameraModalVisible] = useState<boolean>(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v2/auth/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
                const { name } = response.data;
                setUserName(name.split(' ')[0] || 'Guest'); // Default to "Guest" if name is unavailable
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserName('Guest'); // Fallback for errors
            }
        };

        fetchUserData();

        // Set time of day
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay('Good Morning');
        else if (hour < 18) setTimeOfDay('Good Afternoon');
        else setTimeOfDay('Good Evening');
    }, []);

    const handleSnapPhoto = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            setCameraModalVisible(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const closeCameraModal = () => {
        if (videoStream) {
            videoStream.getTracks().forEach((track) => track.stop());
            setVideoStream(null);
        }
        setCameraModalVisible(false);
    };

    const handleUploadGallery = () => {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = 'image/*';
        inputElement.style.display = 'none';

        inputElement.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };

        document.body.appendChild(inputElement);
        inputElement.click();
        document.body.removeChild(inputElement);
    };

    return (
        <div className="home-container">
            <header>
                <h1>{`${timeOfDay}, ${userName}!`}</h1>
            </header>
            <div className="action-buttons">
                <button className="snap-photo-btn" onClick={handleSnapPhoto}>
                    Snap a Photo
                </button>
                <button className="upload-gallery-btn" onClick={handleUploadGallery}>
                    Upload from Gallery
                </button>
            </div>

            {/* Camera Modal */}
            <Modal show={cameraModalVisible} onHide={closeCameraModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Camera Feed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {videoStream && (
                        <video
                            autoPlay
                            playsInline
                            style={{ width: '100%', borderRadius: '8px' }}
                            ref={(video) => {
                                if (video) video.srcObject = videoStream;
                            }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCameraModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* File Preview */}
            {previewImage && (
                <div className="preview-container">
                    <h5 className="preview-title">Image Preview:</h5>
                    <div className="preview-wrapper">
                        <img src={previewImage} alt="Selected file preview" className="preview-image" />
                        <button
                            className="remove-preview-btn"
                            onClick={() => setPreviewImage(null)} // Clear the preview
                        >
                            Remove Preview
                        </button>
                    </div>
                </div>
            )}


            <Navbar fixed="bottom" bg="light" className="bottom-nav">
                <Nav className="w-100 justify-content-around">
                    <Nav.Item>
                        <Nav.Link href="#home">
                            <i className="bi bi-house-fill"></i>
                            <span>Home</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#logs">
                            <i className="bi bi-list-check"></i>
                            <span>Logs</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#profile">
                            <i className="bi bi-person-circle"></i>
                            <span>Profile</span>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        </div>
    );
};

export default HomeScreen;
