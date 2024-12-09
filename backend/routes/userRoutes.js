const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login
router.put('/profile', authenticate, updateUserProfile);

module.exports = router;
