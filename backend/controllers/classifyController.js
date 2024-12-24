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
        // Use the field name 'file' to match the API's expected form field
        formData.append('file', req.file.buffer, req.file.originalname);

        // Call the FastAPI service
        const aiResponse = await axios.post(
            `${process.env.FASTAPI_URL}/classify`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Include form-data headers
                    'Content-Type': 'multipart/form-data', // Explicitly set content type
                },
            }
        );

        // Ensure data exists in the response
        if (!aiResponse || !aiResponse.data) {
            throw new Error('Invalid response from AI service.');
        }

        res.status(200).json(aiResponse.data); // Return the AI service response
    } catch (error) {
        console.error('Error during classification:', error.message);
        res.status(500).json({ message: 'Error classifying image.', error: error.message });
    }
};

module.exports = { classifyImage };
