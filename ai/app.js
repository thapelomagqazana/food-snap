const express = require('express');

const app = express();
app.use(express.json());

// Routes
app.use('/classify', require('./routes/classify'));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Export the app
module.exports = app;

