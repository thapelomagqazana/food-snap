const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

/**
 * Sets up an in-memory MongoDB server for testing.
 */
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Check if a connection already exists
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
});

/**
 * Cleans up the database after each test.
 */
afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({}); // Clear each collection instead of dropping the database
    }
});

/**
 * Stops the in-memory MongoDB server after all tests.
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});