/**
 * Controller to fetch nutritional data for food items.
 */
const FoodItem = require("../models/FoodItem");

/**
 * Fetch nutritional data for a food item by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getNutritionData = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format.' });
        }

        
        const foodItem = await FoodItem.findById(id);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found.' });
        }

        res.status(200).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch nutritional data.', error: error.message });
    }
};


module.exports = { getNutritionData };