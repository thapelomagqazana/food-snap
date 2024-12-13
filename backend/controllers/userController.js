/**
 * Controller for user management (Registration and Login).
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

/**
 * Registers a new user.
 * @param {Object} req - Express request object containing name, email, and password.
 * @param {Object} res - Express response object.
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Create a new user
        const user = new User({ name, email, password });
        await user.save();

        // Generate a JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully.', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Logs in an existing user and generates a JWT token.
 * @param {Object} req - Express request object containing email and password.
 * @param {Object} res - Express response object.
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);      
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Updates the authenticated user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Fetch the authenticated user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user fields if provided
        if (name) user.name = name;
        if (email) user.email = email;

        // Hash the new password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Save the updated user to the database
        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User profile updated successfully.',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.', error: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile };