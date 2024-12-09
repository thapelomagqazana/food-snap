const morgan = require('morgan');
const logger = require('../utils/logger');

/**
 * Morgan middleware configuration for HTTP request logging.
 */
const morganMiddleware = morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
});

module.exports = morganMiddleware;
