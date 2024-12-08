/**
 * Mongoose schema and model for User data.
 * Defines fields for user account and includes password hashing functionality.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User's name.
    email: { type: String, required: true, unique: true }, // User's email (must be unique)
    password: { type: String, required: true }, // Hashed password
    preferences: { type: String }, // User's dietary preferences (e.g., vegetarian)
});

// Middleware to hash password before saving a user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip hashing if password isn't modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);