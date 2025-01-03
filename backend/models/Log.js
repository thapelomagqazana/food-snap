const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealTime: { type: String, required: true }, // e.g., Breakfast, Lunch, Dinner
    items: [
        {
            name: { type: String, required: true }, // Food item name
            calories: { type: Number, required: true },
            protein: { type: Number, required: true },
            carbs: { type: Number, required: true },
            fats: { type: Number, required: true },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
