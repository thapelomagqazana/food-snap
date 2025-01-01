const { createLogger, format, transports } = require("winston");
const { nodeEnv } = require("../config/env");

// Define log format
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `${timestamp} [${level}]: ${message} - ${stack}` // Log stack trace for errors
            : `${timestamp} [${level}]: ${message}`;
    })
);

// Create logger instance
const logger = createLogger({
    level: nodeEnv === 'production' ? 'info' : 'debug', // Log level based on environment
    format: logFormat,
    transports: [
        // Log to console
        new transports.Console({
            format: format.combine(
                format.colorize(), // Add colors for console logs
                logFormat
            ),
        }),
        // Log to a file
        new transports.File({
            filename: 'logs/error.log',
            level: 'error', // Log only errors to this file
        }),
        new transports.File({
            filename: 'logs/combined.log',
        }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' }),
    ],
});

// Export the logger instance
module.exports = logger;
