const axios = require('axios');
const FormData = require('form-data');
const NutritionData = require('../../../models/NutritionData'); // Database model for nutrition data
const { exec } = require('child_process');
const { aiServiceURL, fdcAPIKey } = require("../../../config/env");
const logger = require('../../../utils/logger'); // For logging
const redisClient = require('../../../config/redis'); // Redis client for caching


// Recognize food from an uploaded image
exports.recognizeFood = async (req, res, next) => {
    try {
        if (!req.file) {
            logger.warn('Image classification failed: No image uploaded.');
            return res.status(400).json({ message: 'No image uploaded.' });
        }

        logger.info('Preparing image for classification...');
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        logger.info('Sending image to AI service for classification...');
        const aiResponse = await axios.post(
            `${aiServiceURL}/classify`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (!aiResponse || !aiResponse.data) {
            logger.error('Invalid response from AI service.');
            throw new Error('Invalid response from AI service.');
        }

        logger.info('Image classification successful:', aiResponse.data);
        res.status(200).json(aiResponse.data);
    } catch (error) {
        logger.error('Error during image classification:', error.message);
        res.status(500).json({ message: 'Error classifying image.', error: error.message });
    }
};

/**
 * Fetch data using curl.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} - The response data as JSON.
 */
const fetchWithCurl = (url) => {
    return new Promise((resolve, reject) => {
        logger.info(`Fetching data from URL: ${url}`);
        exec(`curl -X GET "${url}"`, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Curl error: ${stderr}`);
                reject(`Error: ${stderr}`);
            } else {
                try {
                    const data = JSON.parse(stdout);
                    resolve(data);
                } catch (parseError) {
                    logger.error(`Error parsing response: ${parseError.message}`);
                    reject(`Error parsing response: ${parseError.message}`);
                }
            }
        });
    });
};

// Get nutritional information for recognized food items
exports.getNutritionalInfo = async (req, res, next) => {
    const foodItems = req.query.foodItems ? req.query.foodItems.split(',') : [];

    if (!foodItems || foodItems.length === 0) {
        logger.warn('Nutritional data request failed: No food items provided.');
        return res.status(400).json({ message: 'No food items provided.' });
    }

    try {
        // Normalize food items for consistency
        const normalizedFoodItems = foodItems.map((item) =>
            item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
        );
        const cacheKey = `nutrition:${normalizedFoodItems.join(',')}`;

        // Check Redis cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            try {
                const parsedCache = JSON.parse(cachedData);
                logger.info(`Serving nutritional data from cache for items: ${normalizedFoodItems.join(',')}`);
                return res.status(200).json({ nutrition: parsedCache });
            } catch (parseError) {
                logger.error('Error parsing Redis cache data:', parseError.message);
            }
        }

        // Fetch data from database
        logger.info('Fetching nutritional data from the database...');
        const nutritionData = await NutritionData.find({
            name: { $in: normalizedFoodItems },
        });

        // Identify missing items
        const missingItems = foodItems.filter(
            (item) => !nutritionData.some((data) => data.name.toUpperCase() === item.toUpperCase())
        );

        if (missingItems.length > 0) {
            logger.info(`Fetching data for missing items from external API: ${missingItems.join(', ')}`);
        }

        // Fetch missing items from external API
        for (const item of missingItems) {
            try {
                const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${item}&pageSize=1&api_key=${fdcAPIKey}`;
                const response = await fetchWithCurl(url);

                if (!response.foods || response.foods.length === 0) {
                    logger.warn(`No data found for ${item} from USDA API.`);
                    continue;
                }

                if (!response.foods || response.foods.length === 0) {
                    logger.warn(`No data found for ${item} from USDA API.`);
                    continue;
                }
                
                // Ensure proper transformation of API response
                const foodData = response.foods[0];
                const { description, foodNutrients } = foodData;
                
                const calories = Math.round(foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0);
                const protein = Math.round(foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0);
                const carbs = Math.round(foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0);
                const fats = Math.round(foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0);

                logger.info(`Data for ${item} successfully updated/inserted into the database.`);
                
                nutritionData.push({
                    name: description.toUpperCase(),
                    calories,
                    protein,
                    carbs,
                    fats,
                });
                
            } catch (error) {
                logger.error(`Error fetching data for ${item} using curl: ${error.message}`);
            }
        }

        // Cache the combined data
        await redisClient.setex(cacheKey, 3600, JSON.stringify(nutritionData));
        logger.info('Nutritional data successfully cached.');

        // Respond with the data
        res.status(200).json({
            message: 'Nutritional data retrieved successfully.',
            nutrition: nutritionData,
        });
    } catch (error) {
        logger.error('Error retrieving nutritional data:', error.message);
        res.status(500).json({ message: 'Error retrieving nutritional data.', error: error.message });
    }
};