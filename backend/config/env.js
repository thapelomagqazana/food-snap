const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config({ path: '../.env' });

// Validate required environment variables
const requiredVariables = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
];

requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
        console.error(`Missing required environment variable: ${variable}`);
        process.exit(1); // Exit the process if a required variable is missing
    }
});

// Export environment variables for use in the application
module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: process.env.REDIS_PORT || 6379,
    redisPassword: process.env.REDIS_PASSWORD || null,
    // aws: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     bucketName: process.env.S3_BUCKET_NAME,
    // },
};
