const Redis = require('ioredis');
const logger = require("../utils/logger");
const { URL } = require('url');
const { redisURL } = require("./env");

// Assume REDIS_URL is provided in the format redis://default:password@host:port
const redisUrl = redisURL || 'redis://127.0.0.1:6379';
const parsedUrl = new URL(redisUrl);

// Initialize Redis client with parsed connection details
const redisClient = new Redis({
    host: parsedUrl.hostname,
    port: parsedUrl.port,
    password: parsedUrl.password,
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
    logger.error('Redis error:', err);
    process.exit(1); // Exit with failure code
});

module.exports = redisClient;
