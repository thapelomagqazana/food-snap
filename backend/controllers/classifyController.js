const axios = require('axios');
const FormData = require('form-data');
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

/**
 * Calls the AI service for image classification.
 */
const classifyImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded.' });
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, req.file.originalname);

        // Call AI service
        const aiResponse = await axios.post(
            `${process.env.FASTAPI_URL}/classify`,
            formData,
            { headers: formData.getHeaders() }
        );
    
        // Ensure data exists
        if (!aiResponse || !aiResponse.data) {
            throw new Error('Invalid response from AI service.');
        }
    
        res.status(200).json(aiResponse.data);
    } catch (error) {
        res.status(500).json({ message: 'Error classifying image.', error: error.message });
    }
};

module.exports = { classifyImage };
