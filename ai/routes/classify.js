const express = require('express');
const fs = require('fs');
const { classifyImage } = require('../utils/modelUtils');
const { preprocessImage } = require('../utils/imageUtils');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * POST /api/classify
 * Endpoint for classifying uploaded images.
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded.' });
    }
    
    const filePath = req.file.path;

    // Preprocess and classify the image
    const imageTensor = preprocessImage(filePath);
    const predictions = await classifyImage(imageTensor);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Image classified successfully.',
      predictions,
    });
  } catch (error) {
    console.error('Error during classification:', error.message);
    res.status(500).json({ message: 'Classification failed.', error: error.message });
  }
});

module.exports = router;
