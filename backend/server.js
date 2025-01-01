/**
 * Main server file for FoodSnap backend application.
 * This file initializes the Express server, connects to the database, and sets up routes.
 */
const dotenv = require("dotenv");
const app = require("./app");
const { port } = require("./config/env");
const connectDB = require('./config/db');


// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

// Start the server
const PORT = port;
// Start the server after the database connection is established
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});
