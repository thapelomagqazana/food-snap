/**
 * Configuration file for MongoDB connection.
 * This file exports a function to establish a connection to the MongoDB database.
 */

const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using Mongoose.
 * Logs a success message if connected, otherwise exits the process with an error.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Database connection failed:", error);
        process.exit(1); // Exit with failure code
    }
};

module.exports = connectDB;