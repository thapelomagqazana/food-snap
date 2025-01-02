const request = require('supertest');
const path = require('path');
const app = require('../../app');
const axios = require('axios');
const logger = require('../../utils/logger');
const redisClient = require('../../config/redis');
const mongoose = require('mongoose');

jest.mock('axios'); // Mock axios to simulate AI service responses


afterAll(async () => {
    await redisClient.quit(); // Close Redis connection
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /recognize', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Upload a valid image file for food classification', async () => {
        axios.post.mockResolvedValueOnce({
            data: { recognizedItems: ['Pizza', 'Salad'] },
        });
    
        const filePath = path.resolve(__dirname, 'test-files/pizza.jpg');
        const response = await request(app)
            .post('/api/v2/food/recognize')
            .attach('file', filePath);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('recognizedItems');
        expect(response.body.recognizedItems).toEqual(['Pizza', 'Salad']);
    });

    test('Call the endpoint without uploading an image', async () => {
        const response = await request(app).post('/api/v2/food/recognize');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No image uploaded.');
    });

    test('Upload a very large image file', async () => {
        const response = await request(app)
            .post('/api/v2/food/recognize')
            .attach('file', path.resolve(__dirname, 'test-files/large-image.jpg'));

        expect(response.status).toBe(413);
    });

    test('Simulate a failure in the AI service', async () => {
        axios.post.mockRejectedValueOnce(new Error('AI Service Unavailable'));

        const response = await request(app)
            .post('/api/v2/food/recognize')
            .attach('file', path.resolve(__dirname, 'test-files/pizza.jpg'));

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error classifying image.');
    });

    test('Upload an image with unsupported food categories', async () => {
        axios.post.mockResolvedValueOnce({
            data: { recognizedItems: [] },
        });

        const response = await request(app)
            .post('/api/v2/food/recognize')
            .attach('file', path.resolve(__dirname, 'test-files/utensils.jpg'));

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('recognizedItems');
        expect(response.body.recognizedItems).toEqual([]);
    });
});