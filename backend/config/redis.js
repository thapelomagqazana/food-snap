const Redis = require('ioredis');
const logger = require("../utils/logger");
const { redisHost, redisPort, redisPassword } = require("./env");

const redisClient = new Redis({
    host: redisHost || '127.0.0.1',
    port: redisPort || 6379,
    password: redisPassword || undefined,
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
    logger.error('Redis error:', err);
    process.exit(1); // Exit with failure code
});

module.exports = redisClient;
