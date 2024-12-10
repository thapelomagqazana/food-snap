const express = require('express');
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const morganMiddleware = require("./middleware/loggingMiddleware");
// Initialize app and connect to the database
const app = express();


// Middleware for request logging
app.use(morganMiddleware);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/classify', require('./routes/classifyRoutes'));

// Error-handling middleware (should be the last middleware)
app.use(errorHandler);

// Export the app
module.exports = app;
