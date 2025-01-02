const express = require('express');
const { register, login, getProfile, editUserProfile } = require('../controllers/authController');
const { authMiddleware } = require('../../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register); // Public
router.post('/login', login); // Public
router.get('/profile', authMiddleware, getProfile); // Protected
router.put('/profile', authMiddleware, editUserProfile);

module.exports = router;
