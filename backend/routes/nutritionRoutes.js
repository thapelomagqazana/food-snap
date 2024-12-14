const express = require('express');
const { getNutritionData } = require('../controllers/nutritionController');

const router = express.Router();

/**
 * POST /nutrition
 * Retrieve nutritional information for identified food items.
 */
router.post('/', getNutritionData);

module.exports = router;
