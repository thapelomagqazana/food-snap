const request = require('supertest');
const app = require('../../app');
const NutritionData = require('../../models/NutritionData');
const redisClient = require('../../config/redis'); // Ensure Redis is mocked correctly

jest.mock('../../config/redis', () => ({
    get: jest.fn(),
    setex: jest.fn(),
}));

jest.mock('../../models/NutritionData');

describe('GET /nutrition', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Fetch nutritional information for items in the database', async () => {
        NutritionData.find.mockResolvedValueOnce([
            { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 },
        ]);

        const response = await request(app).get('/api/v2/food/nutrition?foodItems=Pizza');

        expect(response.status).toBe(200);
        expect(response.body.nutrition).toEqual([
            { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 },
        ]);
    });

    test('Verify Redis cache is used if data is already cached', async () => {
        // Mock Redis to return cached data
        const cachedData = JSON.stringify([{ name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 }]);
        redisClient.get.mockResolvedValueOnce(cachedData);

        const response = await request(app).get('/api/v2/food/nutrition?foodItems=Pizza');

        expect(response.status).toBe(200);
        expect(redisClient.get).toHaveBeenCalledWith('nutrition:PIZZA'); // Check normalized cache key
        expect(response.body.nutrition).toEqual([
            { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 },
        ]);
    });

    test('Fetch nutritional information for items not in the database but available via the external API', async () => {
        redisClient.get.mockResolvedValueOnce(null);
        NutritionData.find.mockResolvedValueOnce([]);
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: async () => ({
                foods: [
                    {
                        description: 'PIZZA',
                        foodNutrients: [
                            { nutrientName: 'Energy', value: 220 },
                            { nutrientName: 'Protein', value: 6.82 },
                            { nutrientName: 'Carbohydrate, by difference', value: 23.5 },
                            { nutrientName: 'Total lipid (fat)', value: 9.09 },
                        ],
                    },
                ],
            }),
        });
        
        // Test assertion
        const response = await request(app).get('/api/v2/food/nutrition?foodItems=Pizza');
        expect(response.status).toBe(200);
        expect(response.body.nutrition).toEqual([
            { name: 'PIZZA', calories: 220, protein: 7, carbs: 24, fats: 9 }, // Rounded or truncated
        ]);
    });

    test('Call the endpoint without providing foodItems in the request body', async () => {
        const response = await request(app).get('/api/v2/food/nutrition');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No food items provided.');
    });

    test('Provide an invalid or empty array for foodItems', async () => {
        const response = await request(app).get('/api/v2/food/nutrition?foodItems=');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('No food items provided.');
    });

    // test('Simulate a Redis cache outage', async () => {
    //     redisClient.get.mockRejectedValueOnce(new Error('Redis unavailable'));
    //     NutritionData.find.mockResolvedValueOnce([
    //         { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 },
    //     ]);

    //     const response = await request(app).get('/api/v2/food/nutrition?foodItems=Pizza');

    //     expect(response.status).toBe(200);
    //     expect(response.body.nutrition).toEqual([
    //         { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 },
    //     ]);
    // });
});
