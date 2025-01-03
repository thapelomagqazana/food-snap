import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Table, Spinner, Alert, Form } from 'react-bootstrap';
import '../styles/ResultsScreen.css';
const BottomNav = lazy(() => import('./BottomNav'));

interface Detection {
    label: string;
    confidence: string;
    thumbnail: string;
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
    const [loadingLog, setLoadingLog] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<{ type: string; message: string } | null>(null);
    const [mealTime, setMealTime] = useState<string>('Breakfast'); // Default meal time

    useEffect(() => {
        if (!detections || detections.length === 0) {
            setError('No food items detected from the model. Redirecting to the home screen...');
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

    const sanitizeValue = (value: any): number => {
        return isNaN(value) || value === null || value === undefined ? 0 : Number(value);
    };

    const totalCalories = nutritionalData.reduce((total, item) => total + sanitizeValue(item.calories), 0);
    const totalProtein = nutritionalData.reduce((total, item) => total + sanitizeValue(item.protein), 0);
    const totalCarbs = nutritionalData.reduce((total, item) => total + sanitizeValue(item.carbs), 0);
    const totalFat = nutritionalData.reduce((total, item) => total + sanitizeValue(item.fat), 0);

    const handleLogMeal = async () => {
        try {
            const payload = {
                mealTime,
                items: nutritionalData,
            };

            setLoadingLog(true);
            setError(null);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v2/logs`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            if (response.status === 201) {
                setAlertMessage({ type: 'success', message: 'Meal logged successfully!' });
                setTimeout(() => {
                    navigate('/daily-logs');
                }, 2000);
            } else {
                throw new Error('Unexpected response while logging meal');
            }
            setLoadingLog(false);
        } catch (err) {
            console.error('Error logging meal:', err);
            setAlertMessage({ type: 'danger', message: 'Failed to log the meal. Please try again.' });
            setLoadingLog(false);
        }
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
                <Button variant="primary" onClick={handleScanAnother}>
                    Try Again
                </Button>
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
                            <Card.Img 
                                variant="top" 
                                src={detection.thumbnail} 
                                alt={`Thumbnail of ${detection.label}`} 
                                className="food-thumbnail" 
                            />
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

            <Form.Group className="meal-time-selector">
                <Form.Label>Select Meal Time</Form.Label>
                <Form.Select value={mealTime} onChange={(e) => setMealTime(e.target.value)}>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                </Form.Select>
            </Form.Group>

            {alertMessage && (
                <Alert variant={alertMessage.type} onClose={() => setAlertMessage(null)} dismissible>
                    {alertMessage.message}
                </Alert>
            )}

            <div className="action-buttons">
                <Button variant="success" onClick={handleLogMeal} disabled={loadingLog}>
                    {loadingLog ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {' '}Logging...
                        </>
                    ) : (
                        'Log This Meal'
                    )}
                </Button>
                <Button variant="primary" onClick={handleScanAnother}>
                    Scan Another
                </Button>
            </div>
            <Suspense fallback={<div>Loading navigation...</div>}>
                <BottomNav />
            </Suspense>

        </div>
    );
};

export default ResultsScreen;
