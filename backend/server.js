/**
 * Main server file for FoodSnap backend application.
 * This file initializes the Express server, connects to the database, and sets up routes.
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config()

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()) // Parse incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// Routes
app.use("/api/images", require("./routes/imageRoutes"));  // Routes for image processing
app.use('/api/users', require('./routes/userRoutes')); // Routes for user management
app.use('/api/nutrition', require('./routes/nutritionRoutes')); // Routes for nutritional data

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
