const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');
const { preprocessImage } = require('../utils/imageUtils');
const { loadModel, classifyImage, fetchClassNames } = require('../utils/modelUtils');

jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress error logs
jest.mock('../utils/imageUtils');
jest.mock('../utils/modelUtils');

describe('Classify Route', () => {
    const mockFilePath = path.join(__dirname, 'test-image.jpg');

    // Ensure fetchClassNames completes before tests
    beforeAll(async () => {
        await fetchClassNames();
    });

    beforeAll(() => {
        fs.writeFileSync(mockFilePath, 'dummy content');
        preprocessImage.mockReturnValue('mockTensor');
        loadModel.mockResolvedValue({
            predict: jest.fn(() => ({
                dataSync: jest.fn(() => [0.9, 0.8, 0.7]),
            })),
        });
        classifyImage.mockResolvedValue([
            { className: 'Class 0', probability: 0.9 },
            { className: 'Class 1', probability: 0.8 },
            { className: 'Class 2', probability: 0.7 },
        ]);
    });

    afterAll(() => {
        fs.unlinkSync(mockFilePath);
    });

    it('should classify an uploaded image successfully', async () => {
        const response = await request(app)
            .post('/classify')
            .attach('image', mockFilePath);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Classification successful.');
        expect(response.body.predictions).toEqual([
            { className: 'Class 0', probability: 0.9 },
            { className: 'Class 1', probability: 0.8 },
            { className: 'Class 2', probability: 0.7 },
        ]);
    });

    it('should return 400 if no image is uploaded', async () => {
        const response = await request(app).post('/classify');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No image uploaded.');
    });

    it('should return 500 if an error occurs during classification', async () => {
        preprocessImage.mockImplementation(() => {
            throw new Error('Preprocessing error');
        });

        const response = await request(app)
            .post('/classify')
            .attach('image', mockFilePath);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Classification failed.');
        expect(response.body.error).toBe('Preprocessing error');
    });
});
