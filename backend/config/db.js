/**
 * Configuration file for MongoDB connection.
 * This file exports a function to establish a connection to the MongoDB database.
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");
const { mongoURI } = require("./env");

/**
 * Connects to the MongoDB database using Mongoose.
 * Logs a success message if connected, otherwise exits the process with an error.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1); // Exit with failure code
    }
};

module.exports = connectDB;