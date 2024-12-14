const request = require('supertest');
const app = require("../app");
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');


describe('Classify Routes', () => {
    let mockAxios;

    beforeAll(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterAll(() => {
        mockAxios.restore();
    });

    beforeEach(() => {
        mockAxios.reset();
    });

    it('should return 400 if no image is uploaded', async () => {
        const res = await request(app).post('/api/classify/image');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'No image uploaded.' });
    });

    it('should classify an uploaded image successfully', async () => {
        // Mock AI service response
        mockAxios.onPost(`${process.env.AI_URL}/classify`).reply(200, {
            predictions: [{ className: 'apple', probability: 0.9 }],
        });

        const res = await request(app)
            .post('/api/classify/image')
            .attach('image', Buffer.from('mock image content'), 'test.jpg');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('predictions');
    });

    it('should return 500 if AI service fails', async () => {
        // Mock AI service error
        mockAxios.onPost(`${process.env.AI_URL}/classify`).networkError();

        const res = await request(app)
            .post('/api/classify/image')
            .attach('image', Buffer.from('mock image content'), 'test.jpg');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Error classifying image.');
    });
});
