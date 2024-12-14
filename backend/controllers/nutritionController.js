/**
 * Controller to fetch nutritional data for food items.
 */
const NutritionData = require("../models/NutritionData");

/**
 * Fetch nutritional data for identified food items.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNutritionData = async (req, res) => {
    const { foodItems } = req.body; // Array of identified food items (e.g., ["apple", "banana"])

    try {
        if (!foodItems || foodItems.length === 0) {
            return res.status(400).json({ message: 'No food items provided.' });
        }

        // Query the database for nutritional data
        const nutritionData = await NutritionData.find({
            name: { $in: foodItems },
        });

        // If no data found for some items, fetch from USDA API
        if (nutritionData.length < foodItems.length) {
            const missingItems = foodItems.filter(
                (item) => !nutritionData.some((data) => data.name.toLowerCase() === item.toLowerCase())
            );

            for (const item of missingItems) {
                try {
                    // Use the USDA FoodData Central API
                    const response = await axios.get(
                        `https://api.nal.usda.gov/fdc/v1/foods/search`,
                        {
                            params: {
                                query: item,
                                pageSize: 1,
                                api_key: process.env.FDC_API_KEY,
                            },
                        }
                    );

                    const foodData = response.data.foods[0];
                    if (foodData) {
                        const { description, foodNutrients } = foodData;

                        const calories = foodNutrients.find(n => n.nutrientName === 'Energy')?.value || 0;
                        const protein = foodNutrients.find(n => n.nutrientName === 'Protein')?.value || 0;
                        const carbs = foodNutrients.find(n => n.nutrientName === 'Carbohydrate, by difference')?.value || 0;
                        const fats = foodNutrients.find(n => n.nutrientName === 'Total lipid (fat)')?.value || 0;

                        // Save new data to the database
                        const newNutritionData = new NutritionData({
                            name: description,
                            calories,
                            protein,
                            carbs,
                            fats,
                        });
                        await newNutritionData.save();

                        nutritionData.push(newNutritionData);
                    }
                } catch (apiError) {
                    console.error(`Error fetching data for ${item}:`, apiError.message);
                }
            }
        }

        res.status(200).json({
            message: 'Nutritional data retrieved successfully.',
            nutrition: nutritionData,
        });
    } catch (error) {
        console.error('Error retrieving nutritional data:', error);
        res.status(500).json({ message: 'Error retrieving nutritional data.', error: error.message });
    }
};


module.exports = { getNutritionData };