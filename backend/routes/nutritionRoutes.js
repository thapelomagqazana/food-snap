const express = require('express');
const { getNutritionData } = require('../controllers/nutritionController');

const router = express.Router();

/**
 * GET /api/nutrition/:id
 * Fetch nutritional data for a food item by ID.
 */
router.get('/:id', getNutritionData);

module.exports = router;
