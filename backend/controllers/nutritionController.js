/**
 * Controller to fetch nutritional data for food items.
 */
const NutritionData = require("../models/NutritionData");
const { exec } = require("child_process");
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

/**
 * Fetch data using curl.
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} - The response data as JSON.
 */
const fetchWithCurl = (url) => {
    return new Promise((resolve, reject) => {
        exec(`curl -X GET "${url}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Curl error: ${stderr}`);
                reject(`Error: ${stderr}`);
            } else {
                try {
                    const data = JSON.parse(stdout);
                    resolve(data);
                } catch (parseError) {
                    reject(`Error parsing response: ${parseError.message}`);
                }
            }
        });
    });
};

/**
 * Fetch nutritional data for identified food items.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNutritionData = async (req, res) => {
    const { foodItems } = req.body;

    try {
        if (!foodItems || foodItems.length === 0) {
            return res.status(400).json({ message: 'No food items provided.' });
        }

        // Find existing nutrition data for the provided food items
        const nutritionData = await NutritionData.find({
            name: { $in: foodItems.map(item => item.toUpperCase()) }, // Normalize to uppercase
        });

        // Find missing items not already in the database
        const missingItems = foodItems.filter(
            item => !nutritionData.some(data => data.name.toUpperCase() === item.toUpperCase())
        );

        for (const item of missingItems) {
            try {
                const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${item}&pageSize=1&api_key=${process.env.FDC_API_KEY}`;
                const response = await fetchWithCurl(url);

                if (!response.foods || response.foods.length === 0) {
                    console.warn(`No data found for ${item} from USDA API.`);
                    continue;
                }

                const foodData = response.foods[0];
                const { description, foodNutrients } = foodData;

                const calories = foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0;
                const protein = foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0;
                const carbs = foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0;
                const fats = foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0;

                // Upsert the data into the database
                const updatedData = await NutritionData.findOneAndUpdate(
                    { name: description.toUpperCase() }, // Case-insensitive match
                    {
                        name: description.toUpperCase(),
                        calories,
                        protein,
                        carbs,
                        fats,
                    },
                    { upsert: true, new: true } // Insert if not found, and return the updated document
                );

                nutritionData.push(updatedData);
            } catch (curlError) {
                console.error(`Error fetching data for ${item} using curl:`, curlError);
            }
        }

        res.status(200).json({
            message: 'Nutritional data retrieved successfully.',
            nutrition: nutritionData,
        });
    } catch (error) {
        console.error("General error:", error);
        res.status(500).json({ message: 'Error retrieving nutritional data.', error: error.message });
    }
};



module.exports = { getNutritionData };