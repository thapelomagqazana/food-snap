const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Log = require('../../models/Log');
const User = require('../../models/User');
const redisClient = require('../../config/redis');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config({ path: '../.env' });

let token;
let user;
let logId;

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://127.0.0.1:27017/foodsnap_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Create a user for testing
    user = await User.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await bcrypt.hash('password123', 10),
    });

    // Generate a valid token
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterEach(async () => {
    await Log.deleteMany(); // Clear logs after each test
});

afterAll(async () => {
    await redisClient.quit(); // Gracefully close the Redis connection
    // Clean up and disconnect
    await User.deleteMany();
    await Log.deleteMany();
    await mongoose.disconnect();
});

describe('Create Meal Log API Tests', () => {
    test('Create a new meal log (valid mealTime and items)', async () => {
        const response = await request(app)
            .post('/api/v2/logs')
            .send({
                mealTime: 'Breakfast',
                items: [
                    { name: 'Eggs', calories: 150, protein: 12, carbs: 1, fats: 10 },
                    { name: 'Toast', calories: 75, protein: 2, carbs: 14, fats: 1 },
                ],
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Meal log created successfully');
        expect(response.body.log.mealTime).toBe('Breakfast');
        expect(response.body.log.items).toHaveLength(2);
    });

    test('Create a log with missing mealTime or items', async () => {
        const response = await request(app)
            .post('/api/v2/logs')
            .send({
                items: [
                    { name: 'Eggs', calories: 150, protein: 12, carbs: 1, fats: 10 },
                ],
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('mealTime and items are required');
    });

    test('Create a log with an empty items array', async () => {
        const response = await request(app)
            .post('/api/v2/logs')
            .send({
                mealTime: 'Lunch',
                items: [],
            })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('mealTime and items are required');
    });

    test('Create a log with a very long mealTime string', async () => {
        const longMealTime = 'Breakfast'.repeat(100);
    
        const response = await request(app)
            .post('/api/v2/logs')
            .send({
                mealTime: longMealTime,
                items: [
                    { name: 'Eggs', calories: 150, protein: 12, carbs: 1, fats: 10 },
                ],
            })
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('mealTime exceeds maximum allowed length');
    });

    test('Create a log with valid mealTime but an invalid item structure', async () => {
        const response = await request(app)
            .post('/api/v2/logs')
            .send({
                mealTime: 'Dinner',
                items: [
                    { name: 'Steak' }, // Missing other required fields
                ],
            })
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Each item must include name, calories, protein, carbs, and fat');
    });
    
});

describe('Fetch Daily Logs API Tests', () => {
    test('Fetch daily logs for the authenticated user', async () => {
        // Create logs for today
        await Log.create([
            {
                userId: user._id,
                mealTime: 'Breakfast',
                items: [{ name: 'Eggs', calories: 150, protein: 12, carbs: 1, fats: 10 }],
            },
            {
                userId: user._id,
                mealTime: 'Lunch',
                items: [{ name: 'Salad', calories: 200, protein: 5, carbs: 15, fats: 5 }],
            },
        ]);

        const response = await request(app)
            .get('/api/v2/logs/daily')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.logs).toHaveLength(2);
    });

    test('Fetch logs by a specific date', async () => {
        const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        await Log.create([
            {
                userId: user._id,
                mealTime: 'Breakfast',
                items: [
                    { name: 'Eggs', calories: 78, protein: 6, carbs: 0, fats: 5 },
                    { name: 'Toast', calories: 64, protein: 2, carbs: 12, fats: 1 },
                ],
                createdAt: new Date(date), // Specific date
            },
            {
                userId: user._id,
                mealTime: 'Lunch',
                items: [
                    { name: 'Salad', calories: 150, protein: 5, carbs: 10, fats: 7 },
                ],
                createdAt: new Date(date), // Specific date
            },
        ]);
        const date1 = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

        const response = await request(app)
            .get(`/api/v2/logs?date=${date1}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.logs).toHaveLength(2); // Expect 2 logs for the given date
    });

    test('Fetch logs by date with a missing date parameter', async () => {
        const response = await request(app)
            .get('/api/v2/logs')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Date query parameter is required');
    });

    test('Fetch logs when no logs exist', async () => {
        const today = new Date().toISOString().split('T')[0];

        const response = await request(app)
            .get(`/api/v2/logs?date=${today}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.logs).toHaveLength(0);
    });

    test('Fetch logs with invalid date format', async () => {
        const invalidDate = 'invalid-date';
    
        const response = await request(app)
            .get(`/api/v2/logs?date=${invalidDate}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid date format. Expected format is YYYY-MM-DD');
    });
});

describe('Delete Meal Log API Tests', () => {
    beforeEach(async () => {
        // Clear logs before each test and create a new log
        await Log.deleteMany();
    
        const log = await Log.create({
            userId: user._id,
            mealTime: 'Breakfast',
            items: [{ name: 'Eggs', calories: 78, protein: 6, carbs: 0, fats: 5 }],
        });
    
        logId = log._id; // Store logId for testing
    });

    test('Delete a meal log (valid logId)', async () => {
        const response = await request(app)
            .delete(`/api/v2/logs/${logId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Meal log deleted successfully');

        // Verify the log no longer exists
        const log = await Log.findById(logId);
        expect(log).toBeNull();
    });

    test('Delete a log with an invalid logId (non-existent log)', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .delete(`/api/v2/logs/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Log not found');
    });

    test('Unauthorized access (no authentication token provided)', async () => {
        const response = await request(app).delete(`/api/v2/logs/${logId}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });

    test('Delete a log with an already deleted or non-existent logId', async () => {
        // Delete the log first
        await Log.findByIdAndDelete(logId);

        // Attempt to delete it again
        const response = await request(app)
            .delete(`/api/v2/logs/${logId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Log not found');
    });

    test('Delete a log with an invalid logId format', async () => {
        const invalidLogId = 'invalid-id-format';

        const response = await request(app)
            .delete(`/api/v2/logs/${invalidLogId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid logId format');
    });

    test('Simultaneous deletion and fetching of logs', async () => {
        const deleteResponse = request(app)
            .delete(`/api/v2/logs/${logId}`)
            .set('Authorization', `Bearer ${token}`);

        const fetchResponse = request(app)
            .get('/api/v2/logs/daily')
            .set('Authorization', `Bearer ${token}`);

        const [deleteRes, fetchRes] = await Promise.all([deleteResponse, fetchResponse]);

        // Validate delete response
        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe('Meal log deleted successfully');

        // Validate fetch response (should not include the deleted log)
        expect(fetchRes.status).toBe(200);
        expect(fetchRes.body.logs).toHaveLength(0);
    });
});
