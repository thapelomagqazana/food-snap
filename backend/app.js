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
// app.use('/api/images', require('./routes/imageRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/nutrition', require('./routes/nutritionRoutes'));
// app.use('/api/classify', require('./routes/classifyRoutes'));

// Version 2 Routes
app.use('/api/v2/auth', require("./versions/v2/routes/authRoutes"));
app.use('/api/v2/food', require("./versions/v2/routes/foodRoutes"));
// app.use('/api/v2/logs', v2LogRoutes);



// Error-handling middleware (should be the last middleware)
app.use(errorHandler);

// Export the app
module.exports = app;
