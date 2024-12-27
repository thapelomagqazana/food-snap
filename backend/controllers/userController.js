/**
 * Controller for user management (Registration and Login).
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../utils/emailTransporter");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
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

        // Update the logo path to use the backend's static file
        const logoUrl = `../static/images/foodTrack.webp`;

        // Send verification email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email - FoodTrack",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    <header style="text-align: center; margin-bottom: 20px;">
                        <img src=${logoUrl} alt="FoodTrack Logo" style="width: 150px; margin-bottom: 10px;" />
                        <h1 style="color: #2e7d32; font-size: 24px; margin: 0;">Welcome to FoodTrack!</h1>
                    </header>
                    <p style="font-size: 16px; margin: 0 0 15px;">
                        Thank you for signing up with FoodTrack. We're excited to have you on board!
                    </p>
                    <p style="font-size: 16px; margin: 0 0 20px;">
                        Please confirm your email address to start tracking your meals and managing your nutrition effectively.
                    </p>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #2e7d32; color: white; text-decoration: none; font-size: 16px; border-radius: 4px; font-weight: bold;">
                            Verify Email
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666; margin: 0;">
                        If you did not sign up for FoodTrack, please ignore this email. This verification link will expire in 24 hours.
                    </p>
                    <footer style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
                        <p style="margin: 0;">FoodTrack © 2024 | Your Nutrition Buddy</p>
                        <p style="margin: 0;">Need help? <a href="mailto:support@foodtrack.com" style="color: #2e7d32; text-decoration: none;">Contact Support</a></p>
                    </footer>
                </div>
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

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/profilePictures");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer to save uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the ensured upload directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${timestamp}-${sanitizedFileName}`);
  },
});

const upload = multer({ storage });

/**
 * Updates the authenticated user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateUserProfile = async (req, res) => {
    const { name, password, preferences, profilePicture } = req.body;

    try {
        // Fetch the authenticated user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user fields if provided
        if (name) user.name = name;
        if (preferences) user.preferences = preferences;

        // Hash the new password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Handle profile picture upload (Multer)
        if (req.file) {
            user.profilePicture = `/uploads/profilePictures/${req.file.filename}`;
        } else if (profilePicture) {
            // Handle URL-based profile picture
            user.profilePicture = profilePicture;
        }

        // Save the updated user to the database
        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User profile updated successfully.',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                preferences: updatedUser.preferences,
                profilePicture: updatedUser.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.', error: error.message });
    }
};

/**
 * Fetch the user's profile.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const fetchUserProfile = async (req, res) => {
    try {
        // Fetch the user data using the userId from the token
        const user = await User.findById(req.user.id);
    
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
    
        res.status(200).json({
          name: user.name,
          email: user.email,
          preferences: user.preferences || null,
          profilePicture: user.profilePicture || null,
        });
      } catch (error) {
        res.status(500).json({ message: `Error fetching user profile: ${error.message}`});
      }
};

module.exports = { registerUser, loginUser, updateUserProfile, verifyEmail, upload, fetchUserProfile };