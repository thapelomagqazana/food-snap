const express = require('express');
const cors = require('cors');
const path = require("path");
const { frontendURL } = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const morganMiddleware = require("./middleware/loggingMiddleware");
// Initialize app and connect to the database
const app = express();

app.get('/', (req, res) => res.send('CaloriSee Backend Running'));

// Middleware for request logging
app.use(morganMiddleware);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
    origin: frontendURL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));


// Version 2 Routes
app.use('/api/v2/auth', require("./versions/v2/routes/authRoutes"));
app.use('/api/v2/food', require("./versions/v2/routes/foodRoutes"));
app.use('/api/v2/logs', require("./versions/v2/routes/logRoutes"));



// Error-handling middleware (should be the last middleware)
app.use(errorHandler);

// Export the app
module.exports = app;
