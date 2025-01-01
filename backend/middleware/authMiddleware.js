const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { jwtSecret } = require("../config/env");

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

    if (!token) {
        logger.warn('Unauthorized access: Missing token');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        logger.error('Unauthorized access: Invalid token', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
