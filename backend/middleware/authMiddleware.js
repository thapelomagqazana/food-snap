/**
 * Middleware to verify JSON Web Tokens (JWT) for protected routes.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure User model is imported for database lookup

/**
 * Middleware function to authenticate user requests.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 */
const authenticate = async (req, res, next) => {
    // Get the token from the request headers
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract the token

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database and attach it to the request object
        req.user = await User.findById(decoded.id).select("-password");

        next(); // Pass control to the next middleware
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = { authenticate };
