/**
 * Mongoose schema and model for Food Items.
 * Stores nutritional information for food items such as calories, protein, carbs, and fats.
 */

const mongoose = require("mongoose");

// Define FoodItem schema
const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Food name (e.g., "Pizza")
    calories: { type: Number, required: true }, // Calorie value
    protein: { type: Number }, // Protein content in grams
    carbs: { type: Number }, // Carbohydrates content in grams
    fats: { type: Number }, // Fats content in grams
    servingSize: { type: String }, // Serving size description (e.g., "1 slice")
});

module.exports = mongoose.model("FoodItem", foodItemSchema);