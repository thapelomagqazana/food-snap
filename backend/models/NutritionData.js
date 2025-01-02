/**
 * Mongoose schema and model for NutritionData.
 * Stores nutritional information for food items such as calories, protein, carbs, and fats.
 */

const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
});

module.exports = mongoose.model('NutritionData', NutritionSchema);
