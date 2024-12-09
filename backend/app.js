const express = require('express');
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
// Initialize app and connect to the database
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));

// Error-handling middleware (should be the last middleware)
app.use(errorHandler);

// Export the app
module.exports = app;
