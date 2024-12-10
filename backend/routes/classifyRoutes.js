const express = require('express');
const multer = require('multer');
const { classifyImage } = require('../controllers/classifyController');

const router = express.Router();
const upload = multer();

router.post('/image', upload.single('image'), classifyImage);

module.exports = router;
