/**
 * Mongoose schema and model for User data.
 * Defines fields for user account and includes password hashing functionality.
 */

const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name.
    email: { type: String, required: true, unique: true }, // User's email (must be unique)
    password: { type: String, required: true }, // Hashed password
    preferences: { type: [String], default: [] }, // Array of preferences
    isVerified: { type: Boolean, default: false }, // For email verification
    profilePicture: { type: String, default: "" }, // URL or file path
});

module.exports = mongoose.model("User", userSchema);