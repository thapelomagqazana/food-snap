/**
 * Main server file for FoodSnap backend application.
 * This file initializes the Express server, connects to the database, and sets up routes.
 */
const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require('./config/db');


// Load environment variables from .env file
dotenv.config()

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
