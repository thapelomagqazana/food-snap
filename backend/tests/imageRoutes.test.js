const request = require('supertest');
const app = require('../app');
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

describe('Image Routes', () => {
    const testImagePath = path.join(__dirname, 'test-image.jpg');

    /**
     * Connects to the test database.
     */
    beforeAll(async () => {
        const testDbUri = process.env.TEST_DB_URI;
        await mongoose.connect(testDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a dummy file for testing
        fs.writeFileSync(testImagePath, 'dummy image content');
    });

    /**
     * Clears all collections in the database after each test.
     */
    afterEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    /**
     * Closes the database connection after all tests are complete.
     */
    afterAll(async () => {
        // Remove dummy file after tests
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }

        await mongoose.connection.close();
    });


    it('should process an uploaded image and return recognized foods', async () => {
        const response = await request(app)
            .post('/api/images/process')
            .attach('image', testImagePath);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Image processed successfully.');
        expect(response.body).toHaveProperty('recognizedFoods');
        expect(Array.isArray(response.body.recognizedFoods)).toBe(true);
    });

    it('should return 400 if no file is uploaded', async () => {
        const response = await request(app).post('/api/images/process');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'No file uploaded.');
    });

    it('should return 500 if an error occurs during processing', async () => {
        jest.spyOn(fs, 'unlinkSync').mockImplementationOnce(() => {
            throw new Error('Simulated file deletion error');
        });

        const response = await request(app)
            .post('/api/images/process')
            .attach('image', testImagePath);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Failed to process the image.');
        expect(response.body).toHaveProperty('error', 'Simulated file deletion error');
    });

    it('should handle unsupported routes gracefully', async () => {
        const response = await request(app).post('/api/images/unsupported');
    
        expect(response.status).toBe(404); // Assuming you have a 404 middleware
    });
});
