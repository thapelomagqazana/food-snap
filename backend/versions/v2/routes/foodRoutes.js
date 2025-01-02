const express = require('express');
// const { authMiddleware } = require('../../../middleware/authMiddleware');
const { recognizeFood, getNutritionalInfo } = require('../controllers/foodController');
const { upload, multerErrorHandler }  = require("../../../middleware/multer");

const router = express.Router();

// Route for recognizing food from an image
router.post('/recognize', upload.single('file'), multerErrorHandler, recognizeFood);

// Route for fetching nutritional information
router.get('/nutrition', getNutritionalInfo);

module.exports = router;
