/**
 * Mongoose schema and model for NutritionData.
 * Stores nutritional information for food items such as calories, protein, carbs, and fats.
 */

const mongoose = require("mongoose");

// Define FoodItem schema
const nutritionDataSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Food item name
    calories: { type: Number, required: true }, // Calories per serving
    protein: { type: Number, required: true }, // Protein in grams
    carbs: { type: Number, required: true }, // Carbs in grams
    fats: { type: Number, required: true }, // Fats in grams
    servingSize: { type: String }, // Serving size description (e.g., "1 slice")
});

module.exports = mongoose.model("NutritionData", nutritionDataSchema);