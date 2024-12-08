const express = require("express");
const multer = require("multer");
const { processImage } = require("../controllers/imageController");


const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/images/process
 * Processes an uploaded image and performs food recognition.
 */
router.post('/process', upload.single('image'), processImage);

module.exports = router;