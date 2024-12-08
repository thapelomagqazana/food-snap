/**
 * Controller to process an image file for food recognition.
 */

const fs = require("fs");
const path = require("path");

/**
 * Simulates image processing and food recognition.
 * In a real application, integrate with an AI service or custom model here.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const processImage = async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.'});
        }

        // Simulate food recognition (replace this with AI logic)
        const recognizedFoods = ['Pizza', 'Salad', 'Burger'];

        // Clean up uploaded file
        const filePath = path.join(__dirname, '..', req.file.path);
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: 'Image processed successfully.',
            recognizedFoods,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process the image.', error: error.message });
    }
};

module.exports = { processImage };