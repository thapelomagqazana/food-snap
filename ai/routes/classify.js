const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { preprocessImage } = require('../utils/imageUtils');
const { loadModel, classifyImage } = require('../utils/modelUtils');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

/**
 * POST /classify
 * Handles food image classification.
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded.' });
        }

        const filePath = req.file.path;

        // Preprocess image
        const imageTensor = preprocessImage(filePath);

        // Load model and classify
        const model = await loadModel();
        const predictions = await classifyImage(imageTensor, model);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: 'Classification successful.',
            predictions,
        });
    } catch (error) {
        console.error('Error during classification:', error);
        res.status(500).json({ message: 'Classification failed.', error: error.message });
    }
});

module.exports = router;
