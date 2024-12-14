/**
 * Controller for user management (Registration and Login).
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../utils/emailTransporter");
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

/**
 * Registers a new user and sends a verification email.
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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate a verification token
        const verificationToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token valid for 1 day
        );

        // Email verification link
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        // Send verification email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email - FoodTrack",
            html: `
                <h1>Welcome to FoodTrack!</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}" target="_blank">Verify Email</a>
                <p>If you did not sign up for FoodTrack, please ignore this email.</p>
            `,
        });

        res.status(201).json({ message: "Registration successful. Please verify your email." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Verifies a user's email address.
 */
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID and update their verification status
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified." });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token.", error: error.message });
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

module.exports = { registerUser, loginUser, updateUserProfile, verifyEmail };