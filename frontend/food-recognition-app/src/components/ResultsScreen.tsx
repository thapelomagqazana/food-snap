import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Spinner } from 'react-bootstrap';
import '../styles/ResultsScreen.css';
import BottomNav from './BottomNav';

interface Detection {
    label: string;
    confidence: string;
}

interface NutritionalData {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

const ResultsScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { detections } = location.state as { detections: Detection[] };

    const [nutritionalData, setNutritionalData] = useState<NutritionalData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!detections || detections.length === 0) {
            setError('No food items detected. Redirecting to the home screen...');
            setTimeout(() => {
                navigate('/home');
            }, 3000);
            return;
        }

        const fetchNutritionalData = async () => {
            try {
                setLoading(true);
                setError(null);

                const foodItems = detections.map((detection) => detection.label).join(',');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v2/food/nutrition`, {
                    params: { foodItems },
                });

                setNutritionalData(response.data.nutrition);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching nutritional data:', err);
                setError('Failed to retrieve nutritional information. Please try again.');
                setLoading(false);
            }
        };

        fetchNutritionalData();
    }, [detections, navigate]);

    // Utility function to ensure numeric values
    const sanitizeValue = (value: any): number => {
        return isNaN(value) || value === null || value === undefined ? 0 : Number(value);
    };

    // Calculate totals with `NaN` handling
    const totalCalories = nutritionalData.reduce((total, item) => total + sanitizeValue(item.calories), 0);
    const totalProtein = nutritionalData.reduce((total, item) => total + sanitizeValue(item.protein), 0);
    const totalCarbs = nutritionalData.reduce((total, item) => total + sanitizeValue(item.carbs), 0);
    const totalFat = nutritionalData.reduce((total, item) => total + sanitizeValue(item.fat), 0);

    const handleLogMeal = () => {
        console.log('Meal logged:', nutritionalData);
        navigate('/daily-logs');
    };

    const handleScanAnother = () => {
        navigate('/home');
    };

    if (error) {
        return (
            <div className="results-container">
                <header>
                    <h1>Your Meal Analysis</h1>
                </header>
                <p className="error-message">{error}</p>
                {detections && detections.length === 0 ? (
                    <p>Redirecting to the home screen...</p>
                ) : (
                    <Button variant="primary" onClick={handleScanAnother}>
                        Try Again
                    </Button>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="results-container">
                <header>
                    <h1>Your Meal Analysis</h1>
                </header>
                <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                    <p>Fetching nutritional data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-container">
            <header>
                <h1>Your Meal Analysis</h1>
            </header>
            <section>
                <h2>Recognized Food Items</h2>
                <div className="food-items">
                    {detections.map((detection, index) => (
                        <Card key={index} className="food-item-card">
                            <Card.Body>
                                <Card.Title>{detection.label}</Card.Title>
                                <Card.Text>
                                    <strong>Confidence:</strong> {detection.confidence}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </section>
            <section>
                <h2>Nutritional Details</h2>
                <div className="nutritional-table-container">
                    <Table striped bordered hover className="nutritional-table">
                        <thead>
                            <tr>
                                <th>Food Item</th>
                                <th>Calories (kcal)</th>
                                <th>Protein (g)</th>
                                <th>Carbs (g)</th>
                                <th>Fat (g)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nutritionalData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{sanitizeValue(item.calories)}</td>
                                    <td>{sanitizeValue(item.protein)}</td>
                                    <td>{sanitizeValue(item.carbs)}</td>
                                    <td>{sanitizeValue(item.fat)}</td>
                                </tr>
                            ))}
                            <tr className="totals-row">
                                <td><strong>Totals</strong></td>
                                <td><strong>{totalCalories}</strong></td>
                                <td><strong>{totalProtein}</strong></td>
                                <td><strong>{totalCarbs}</strong></td>
                                <td><strong>{totalFat}</strong></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </section>

            <div className="action-buttons">
                <Button variant="success" onClick={handleLogMeal}>
                    Log This Meal
                </Button>
                <Button variant="primary" onClick={handleScanAnother}>
                    Scan Another
                </Button>
            </div>
            <BottomNav />
        </div>
    );
};

export default ResultsScreen;
