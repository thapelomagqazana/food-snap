import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/FoodRecognitionScreen.css';
const BottomNav = lazy(() => import('./BottomNav'));

interface RecognitionState {
    image: string; // Base64 or image URL
    filePath: File | null; // File object of the uploaded image
}

const FoodRecognitionScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract state passed from HomeScreen
    const { image, filePath } = location.state as RecognitionState;

    const [progress, setProgress] = useState<number>(0); // Progress state
    const [isProcessing, setIsProcessing] = useState<boolean>(true); // Processing state
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

    useEffect(() => {
        const processFoodRecognition = async () => {
            try {
                const formData = new FormData();
                if (filePath) {
                    formData.append('file', filePath);
                } else {
                    const blob = await fetch(image).then((res) => res.blob());
                    formData.append('file', blob, 'image.png');
                }

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v2/food/recognize`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                        );
                        setProgress(percentCompleted);
                    },
                });

                console.log('Recognition Response:', response.data);

                setTimeout(() => {
                    navigate('/results', { state: { detections: response.data.detections } }); // Pass results to Results Screen
                }, 1000);
            } catch (error) {
                console.error('Error recognizing food:', error);
                setErrorMessage('Unable to process the image. Please try again.');
                setIsProcessing(false);
            }
        };

        processFoodRecognition();
    }, [filePath, image, navigate]);

    const handleCancel = () => {
        setIsProcessing(false);
        navigate('/home'); // Navigate back to Home Screen
    };

    return (
        <div className="recognition-container">
            <header>
                <h1>Analyzing Your Meal...</h1>
            </header>
            <div className="image-preview-container">
                <img src={image} alt="Uploaded food preview" className="image-preview" />
            </div>
            <div className="progress-bar-container">
                <ProgressBar now={progress} label={`${progress}%`} />
            </div>
            <p className="analyzing-text">Analyzing your image. Please wait...</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Button
                variant="danger"
                onClick={handleCancel}
                disabled={isProcessing}
                className="cancel-button"
            >
                Cancel
            </Button>
            <Suspense fallback={<div>Loading navigation...</div>}>
                <BottomNav />
            </Suspense>
        </div>
    );
};

export default FoodRecognitionScreen;
