const request = require('supertest');
const app = require('../app');
const NutritionData = require('../models/NutritionData');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const transporter = require("../utils/emailTransporter");
const axios = require("axios");

jest.mock('axios');

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

describe('Nutrition Routes', () => {
    /**
     * Connects to the test database.
     */
    beforeAll(async () => {
        const testDbUri = process.env.TEST_DB_URI;
        await mongoose.connect(testDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
        await mongoose.connection.close();
        if (transporter.close) {
            transporter.close();
        }
    });


    it('should return 400 if no food items are provided', async () => {
        const response = await request(app).post('/api/nutrition').send({ foodItems: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No food items provided.');
    });

    it('should return nutritional data from the database if available', async () => {
        const testNutrition = {
            name: 'Apple',
            calories: 52,
            protein: 0.3,
            carbs: 14,
            fats: 0.2,
        };

        await NutritionData.create(testNutrition);

        const response = await request(app)
            .post('/api/nutrition')
            .send({ foodItems: ['Apple'] });

        expect(response.status).toBe(200);
        expect(response.body.nutrition.length).toBe(1);
        expect(response.body.nutrition[0].name).toBe('Apple');
        expect(response.body.nutrition[0].calories).toBe(52);
    });

    it('should fetch missing nutritional data from the USDA API and save it to the database', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                foods: [
                    {
                        description: 'Banana',
                        foodNutrients: [
                            { nutrientName: 'Energy', value: 89 },
                            { nutrientName: 'Protein', value: 1.1 },
                            { nutrientName: 'Carbohydrate, by difference', value: 22.8 },
                            { nutrientName: 'Total lipid (fat)', value: 0.3 },
                        ],
                    },
                ],
            },
        });

        const response = await request(app)
            .post('/api/nutrition')
            .send({ foodItems: ['Banana'] });

        expect(response.status).toBe(200);
        expect(response.body.nutrition.length).toBe(1);
        expect(response.body.nutrition[0].name).toBe('Banana');
        expect(response.body.nutrition[0].calories).toBe(89);

        // Verify data was saved to the database
        const savedData = await NutritionData.findOne({ name: 'Banana' });
        expect(savedData).not.toBeNull();
        expect(savedData.calories).toBe(89);
    });

    it('should handle errors when fetching data from the USDA API', async () => {
        // Mock the console.error function
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        // Mock the USDA API to reject the call
        axios.get.mockRejectedValueOnce(new Error('USDA API Error'));
    
        const response = await request(app)
            .post('/api/nutrition')
            .send({ foodItems: ['Orange'] });
    
        expect(response.status).toBe(200);
        expect(response.body.nutrition.length).toBe(0); // No data found or saved
    
        // Check that console.error was called with a specific string
        const errorCallArgs = consoleErrorMock.mock.calls[0]; // Get the first call's arguments
        expect(errorCallArgs[0]).toContain('Error fetching data for Orange:');
        expect(errorCallArgs[1]).toContain('USDA API Error');
    
        // Restore the original console.error implementation
        consoleErrorMock.mockRestore();
    });
    
    it('should handle server errors gracefully', async () => {
        jest.spyOn(NutritionData, 'find').mockRejectedValueOnce(new Error('Database Error'));

        const response = await request(app)
            .post('/api/nutrition')
            .send({ foodItems: ['Apple'] });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error retrieving nutritional data.');
        expect(response.body.error).toBe('Database Error');
    });

});
