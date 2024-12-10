const request = require('supertest');
const app = require('../app'); // Import your Express app
const User = require('../models/User');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });

describe('User Routes', () => {
    /**
     * Connects to the test database.
     */
    beforeAll(async () => {
        const testDbUri = process.env.TEST_DB_URI;
        await mongoose.connect(testDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    /**
     * Clears all collections in the database after each test.
     */
    afterEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    /**
     * Closes the database connection after all tests are complete.
     */
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a new user and return a token', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
        await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123' });

        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already in use.');
    });

    it('should log in an existing user and return a token', async () => {
        const password = 'password123';
        const user = new User({ name: 'John Doe', email: 'john@example.com', password });
        await user.save();

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should deny login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should return 400 if registration fails due to missing fields', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                email: 'invalid@example.com', // Missing 'name' and 'password'
            });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    
    it('should return 401 if login fails due to non-existent email', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });
    
    it('should return 401 if login fails due to incorrect password', async () => {
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'correctpassword',
        });
        await user.save();
    
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });    

    it('should hash the password before saving the user', async () => {
        const user = new User({
            name: 'Test User',
            email: 'hashingtest@example.com',
            password: 'plaintextpassword',
        });
    
        await user.save();
        const savedUser = await User.findOne({ email: 'hashingtest@example.com' });
    
        expect(savedUser.password).not.toBe('plaintextpassword'); // Password should be hashed
        expect(await bcrypt.compare('plaintextpassword', savedUser.password)).toBe(true);
    });
    
});

describe('PUT /api/users/profile', () => {
    let token;

    /**
     * Connects to the test database.
     */
    beforeAll(async () => {
        const testDbUri = process.env.TEST_DB_URI;
        await mongoose.connect(testDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    /**
     * Clears all collections in the database after each test.
     */
    afterEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    /**
     * Closes the database connection after all tests are complete.
     */
    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        const user = new User({ name: 'Test User', email: 'test@example.com', password: "password123" });
        await user.save();
        // Authenticate the user before each test
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        token = loginResponse.body.token;
    });

    it('should update the user profile successfully', async () => {
        const response = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated User', email: 'updated@example.com' });
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User profile updated successfully.');
        expect(response.body.user).toHaveProperty('name', 'Updated User');
        expect(response.body.user).toHaveProperty('email', 'updated@example.com');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app).put('/api/users/profile').send({ name: 'Unauthorized User' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 403 if the token is invalid', async () => {
        const response = await request(app)
            .put('/api/users/profile')
            .set('Authorization', 'Bearer invalidtoken')
            .send({ name: 'Invalid Token User' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Invalid or expired token.');
    });
});