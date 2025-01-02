/**
 * Main server file for FoodSnap backend application.
 * This file initializes the Express server, connects to the database, and sets up routes.
 */
const app = require("./app");
const { port } = require("./config/env");
const logger = require("./utils/logger");
const connectDB = require('./config/db');

// Start the server
const PORT = port;
// Start the server after the database connection is established
connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    logger.error('Failed to connect to MongoDB:', err);
    console.error('Failed to connect to MongoDB:', err);
});
