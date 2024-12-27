const express = require('express');
const cors = require('cors');
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const morganMiddleware = require("./middleware/loggingMiddleware");
// Initialize app and connect to the database
const app = express();

app.get('/', (req, res) => res.send('FoodSnap Backend Running'));

// Middleware for request logging
app.use(morganMiddleware);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Routes
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/classify', require('./routes/classifyRoutes'));



// Error-handling middleware (should be the last middleware)
app.use(errorHandler);

// Export the app
module.exports = app;
