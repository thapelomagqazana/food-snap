const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); // Public
router.post('/login', login); // Public
router.get('/profile', authMiddleware, getProfile); // Protected

module.exports = router;
