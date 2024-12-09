const express = require('express');
const cors = require('cors');

// Initialize app and connect to the database
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));

// Export the app
module.exports = app;
