import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Button, Card, Accordion, Table, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DailyLogsScreen.css';
const BottomNav = lazy(() => import('./BottomNav'));

interface MealLog {
    mealTime: string;
    items: { name: string; calories: number; protein: number; carbs: number; fats: number }[];
    totalCalories: number;
}

const DailyLogsScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('Today');
    const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
    const [totalCalories, setTotalCalories] = useState<number>(0);
    const goalCalories = 2000; // Set default goal calories
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v2/logs/daily`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    params: { date: selectedDate === 'Today' ? undefined : selectedDate },
                });

                const logs = response.data.logs.map((log: any) => ({
                    mealTime: log.mealTime,
                    items: log.items,
                    totalCalories: log.items.reduce((sum: number, item: any) => sum + item.calories, 0),
                }));

                setMealLogs(logs);
                setTotalCalories(logs.reduce((sum: number, log: MealLog) => sum + log.totalCalories, 0));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching logs:', err);
                setError('Failed to fetch daily logs. Please try again.');
                setLoading(false);
            }
        };

        fetchLogs();
    }, [selectedDate]);

    const handleDateChange = (key: string) => {
        setSelectedDate(key);
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    if (loading) {
        return (
            <div className="logs-container">
                <header>
                    <h1>Your Daily Logs</h1>
                </header>
                <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading daily logs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="logs-container">
                <header>
                    <h1>Your Daily Logs</h1>
                </header>
                <Alert variant="danger">{error}</Alert>
                <div className="action-buttons">
                    <Button variant="primary" onClick={handleBackToHome}>
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="logs-container">
            <header>
                <h1>Your Daily Logs</h1>
            </header>
            <Tabs
                activeKey={selectedDate}
                onSelect={(key) => handleDateChange(key || 'Today')}
                className="date-selector-tabs"
            >
                <Tab eventKey="Today" title="Today" />
                <Tab eventKey="Yesterday" title="Yesterday" />
                <Tab eventKey="Custom" title="Custom Date">
                    <input
                        type="date"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="custom-date-picker"
                    />
                </Tab>
            </Tabs>

            <section className="meal-logs">
                {mealLogs.length === 0 ? (
                    <p className="no-logs-message">No logs available for the selected date.</p>
                ) : (
                    <Accordion>
                        {mealLogs.map((log, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>
                                    {log.mealTime} - {log.totalCalories} kcal
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h5>Items</h5>
                                    <ul>
                                        {log.items.map((item, idx) => (
                                            <li key={idx}>{item.name}</li>
                                        ))}
                                    </ul>
                                    <h5>Details</h5>
                                    <div className="table-responsive">
                                        <Table striped bordered hover className="meal-details-table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Calories (kcal)</th>
                                                    <th>Protein (g)</th>
                                                    <th>Carbs (g)</th>
                                                    <th>Fat (g)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {log.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.name}</td>
                                                        <td>{item.calories}</td>
                                                        <td>{item.protein}</td>
                                                        <td>{item.carbs}</td>
                                                        <td>{item.fats}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </section>

            <section className="summary-section">
                <Card>
                    <Card.Body>
                        <h4>Summary</h4>
                        <p>
                            <strong>Total Calories Today:</strong> {totalCalories} kcal
                        </p>
                        <p>
                            <strong>Goal Calories:</strong> {goalCalories} kcal
                        </p>
                    </Card.Body>
                </Card>
            </section>

            <div className="action-buttons">
                <button className="snap-photo-btn" onClick={handleBackToHome}>
                    Back to Home
                </button>
            </div>
            <Suspense fallback={<div>Loading navigation...</div>}>
                <BottomNav />
            </Suspense>
        </div>
    );
};

export default DailyLogsScreen;
