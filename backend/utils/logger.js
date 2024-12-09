const { createLogger, format, transports } = require("winston");

// Define the log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

// Create the logger
const logger = createLogger({
    level: 'info', // Log level
    format: logFormat,
    transports: [
        // Write all logs to a file
        new transports.File({ filename: 'logs/app.log' }),
        // Write error logs to a separate file
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});

// Log to console in development mode
if (process.env.NODE_ENV === 'development') {
    logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;