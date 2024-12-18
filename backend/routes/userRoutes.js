const express = require('express');
const { 
    registerUser, loginUser, 
    updateUserProfile, verifyEmail,
    upload, fetchUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login
router.get("/verify-email", verifyEmail);
router.put('/profile', authenticate, upload.single("profilePicture"), updateUserProfile);
router.get("/profile", authenticate, fetchUserProfile);

module.exports = router;
