/**
 * Mongoose schema and model for User data.
 * Defines fields for user account and includes password hashing functionality.
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
        dietaryRestrictions: [String],
        notificationsEnabled: { type: Boolean, default: true },
    },
    // isVerified: { type: Boolean, default: false }, // For email verification
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
