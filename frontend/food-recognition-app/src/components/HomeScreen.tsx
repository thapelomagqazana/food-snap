import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
const BottomNav = lazy(() => import('./BottomNav'));
import { useNavigate } from 'react-router-dom';
import '../styles/HomeScreen.css';

const HomeScreen: React.FC = () => {
    const [userName, setUserName] = useState<string>(''); // Dynamically set user's name
    const [timeOfDay, setTimeOfDay] = useState<string>('');
    const [cameraModalVisible, setCameraModalVisible] = useState<boolean>(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const navigate = useNavigate();

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

    const capturePhoto = () => {
        const canvas = document.createElement('canvas');
        const videoElement = document.querySelector('video') as HTMLVideoElement;

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageBase64 = canvas.toDataURL('image/png');
        navigate('/food-recognition', { state: { image: imageBase64, filePath: null } });

        closeCameraModal();
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
                    const imageBase64 = e.target?.result as string;
                    navigate('/food-recognition', { state: { image: imageBase64, filePath: file } });
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
                    <Button variant="success" onClick={capturePhoto}>
                        Capture Photo
                    </Button>
                    <Button variant="secondary" onClick={closeCameraModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Suspense fallback={<div>Loading navigation...</div>}>
                <BottomNav />
            </Suspense>
        </div>
    );
};

export default HomeScreen;
