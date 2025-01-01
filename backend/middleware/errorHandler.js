const logger = require('../utils/logger');
/**
 * Middleware to handle API errors and send appropriate responses.
 * @param {Object} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack || err.message);

    if (err.name === 'MongoNotConnectedError') {
        return res.status(500).json({ message: 'Database unavailable' });
    }

    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
