const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');

describe('Nutrition Routes', () => {
    let foodItemId;

    beforeAll(async () => {
        // Seed the database with a test food item
        const foodItem = new FoodItem({
            name: 'Test Food',
            calories: 200,
            protein: 10,
            carbs: 20,
            fats: 5,
        });

        const savedItem = await foodItem.save();
        foodItemId = savedItem._id;
    });

    afterAll(async () => {
        // Clean up the test database
        await FoodItem.deleteMany({});
    });

    it('should fetch nutritional data for a valid food item ID', async () => {
        const response = await request(app).get(`/api/nutrition/${foodItemId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Test Food');
        expect(response.body).toHaveProperty('calories', 200);
        expect(response.body).toHaveProperty('protein', 10);
        expect(response.body).toHaveProperty('carbs', 20);
        expect(response.body).toHaveProperty('fats', 5);
    });

    it('should return 404 if the food item is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/api/nutrition/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Food item not found.');
    });

    it('should return 400 for an invalid ID format', async () => {
        const response = await request(app).get('/api/nutrition/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid ID format.');
    });

    it('should return 500 if an unexpected error occurs', async () => {
        jest.spyOn(FoodItem, 'findById').mockImplementationOnce(() => {
            throw new Error('Simulated database error');
        });

        const response = await request(app).get(`/api/nutrition/${foodItemId}`);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Failed to fetch nutritional data.');
        expect(response.body).toHaveProperty('error', 'Simulated database error');
    });
});
