const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login

/**
 * Protected Routes
 */
router.get('/profile', authenticate, (req, res) => {
    // Protected route example
    res.json({ message: `Welcome, user ${req.user.id}!`, userId: req.user.id });
});

module.exports = router;
