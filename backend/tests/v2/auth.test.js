const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const User = require('../../models/User');
const logger = require('../../utils/logger');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config({ path: '../.env' });

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://127.0.0.1:27017/foodsnap_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    await User.deleteMany(); // Clear users
});

afterEach(async () => {
    // Clear database after each test
    await User.deleteMany();
});

afterAll(async () => {
    // Disconnect from database
    await mongoose.disconnect();
});

describe('Register Functionality', () => {
    describe('Positive Tests', () => {
        test('Register a new user with valid name, email, and password', async () => {
            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');

            const user = await User.findOne({ email: 'johndoe@example.com' });
            expect(user).not.toBeNull();
            expect(user.name).toBe('John Doe');
        });

        test('Ensure the user password is hashed in the database', async () => {
            await request(app).post('/api/v2/auth/register').send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            });

            const user = await User.findOne({ email: 'johndoe@example.com' });
            expect(user).not.toBeNull();
            expect(user.password).not.toBe('password123'); // Password should be hashed
        });
    });

    describe('Negative Tests', () => {
        test('Attempt registration with an existing email', async () => {
            await User.create({
                name: 'Existing User',
                email: 'johndoe@example.com',
                password: 'password123',
            });

            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });

        test('Register without a name, email, or password', async () => {
            const response = await request(app).post('/api/v2/auth/register').send({});
            expect(response.status).toBe(400);
        });

        test('Register with an invalid email format', async () => {
            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'invalid-email',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
        });

        test('Register with a password less than 6 characters', async () => {
            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: '123',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Edge Cases', () => {
        test('Register with an email containing leading or trailing spaces', async () => {
            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'John Doe',
                    email: '  johndoe@example.com  ',
                    password: 'password123',
                });

            expect(response.status).toBe(201);

            const user = await User.findOne({ email: 'johndoe@example.com' });
            expect(user).not.toBeNull();
        });

        test('Register with a name containing special characters', async () => {
            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'John *&^%$#Doe',
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(201);
        });
    });

    describe('Corner Cases', () => {
        test('Register with an extremely long email or name', async () => {
            const longEmail = `${'a'.repeat(255)}@example.com`;
            const longName = 'a'.repeat(256);

            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: longName,
                    email: longEmail,
                    password: 'password123',
                });

            expect(response.status).toBe(400); // Database or validation error expected
        });

        test('Register with a name or email containing Unicode characters', async () => {
            const response = await request(app)
                .post('/api/v2/auth/register')
                .send({
                    name: 'Jöhn Dœ',
                    email: 'jöhn.dœ@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(201);

            const user = await User.findOne({ email: 'jöhn.dœ@example.com' });
            expect(user).not.toBeNull();
        });
    });
});

describe('Login Functionality', () => {
    let existingUser;

    beforeEach(async () => {
        // Create a user for testing
        existingUser = await User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await bcrypt.hash('password123', 10),
        });
    });

    describe('Positive Tests', () => {
        test('Log in with a valid email and password', async () => {
            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('expiresIn', 3600);
        });

        test('Verify the token is valid and signed with the secret key', async () => {
            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            const { token } = response.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            expect(decoded).toHaveProperty('id', existingUser._id.toString());
        });

        test('Ensure successful login logs the event with the correct user email', async () => {
            const loggerSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});
            await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: 'johndoe@example.com',
                    password: 'password123',
                });

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('User logged in successfully: johndoe@example.com')
            );
            loggerSpy.mockRestore();
        });
    });

    describe('Negative Tests', () => {
        test('Log in with an incorrect email', async () => {
            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: 'wrongemail@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });

        test('Log in with an incorrect password', async () => {
            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: 'johndoe@example.com',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });

        test('Log in without providing email or password', async () => {
            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and password are required');
        });
    });

    describe('Edge Cases', () => {
        test('Log in with an email containing leading or trailing spaces', async () => {
            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: '  johndoe@example.com  ',
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            const user = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(user.id).toBe(existingUser._id.toString());
        });

        test('Log in immediately after password update', async () => {
            existingUser.password = await bcrypt.hash('newpassword123', 10);
            await existingUser.save();

            const response = await request(app)
                .post('/api/v2/auth/login')
                .send({
                    email: 'johndoe@example.com',
                    password: 'newpassword123',
                });

            expect(response.status).toBe(200);
        });
    });

    describe('Corner Cases', () => {
        test('Log in with multiple requests in rapid succession', async () => {
            const loginRequests = Array(5)
                .fill(null)
                .map(() =>
                    request(app).post('/api/v2/auth/login').send({
                        email: 'johndoe@example.com',
                        password: 'password123',
                    })
                );

            const responses = await Promise.all(loginRequests);
            responses.forEach((response) => {
                expect(response.status).toBe(200);
            });
        });
    });
});

describe('Get Profile Functionality', () => {
    let user, token;

    beforeEach(async () => {
        // Create a user for testing
        user = await User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: await bcrypt.hash('password123', 10),
        });

        // Generate a valid token
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('Positive Tests', () => {
        test('Fetch a profile for a valid userId from a token', async () => {
            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', 'John Doe');
            expect(response.body).toHaveProperty('email', 'johndoe@example.com');
            expect(response.body).not.toHaveProperty('password');
        });

        test('Ensure profile data matches the database record', async () => {
            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(user.name);
            expect(response.body.email).toBe(user.email);
        });
    });

    describe('Negative Tests', () => {
        test('Fetch a profile without a token', async () => {
            const response = await request(app).get('/api/v2/auth/profile');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        test('Fetch a profile with an invalid or expired token', async () => {
            const invalidToken = jwt.sign({ id: user._id }, 'invalidsecret', { expiresIn: '1h' });

            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Unauthorized');
        });

        test('Fetch a profile for a non-existent userId', async () => {
            const tokenForNonExistentUser = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            
            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${tokenForNonExistentUser}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });
    });

    describe('Edge Cases', () => {
        test('Fetch a profile where the user was deleted after token generation', async () => {
            await User.deleteOne({ _id: user._id });

            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        test('Fetch a profile with a token nearing its expiration time', async () => {
            const expiringToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2s' });

            await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds


            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${expiringToken}`);

            expect(response.status).toBe(200);
        });
    });

    describe('Corner Cases', () => {
        test('Fetch a profile while the database is temporarily unavailable', async () => {
            await mongoose.disconnect(); // Simulate database unavailability

            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Database unavailable');

            await mongoose.connect('mongodb://127.0.0.1:27017/foodsnap_test', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }); // Reconnect for other tests
        });

        test('Fetch a profile when the user data contains unexpected fields', async () => {
            user.preferences = { dietaryRestrictions: ['Gluten'], notificationsEnabled: false };
            await user.save();

            const response = await request(app)
                .get('/api/v2/auth/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).not.toHaveProperty('unexpectedField');
            expect(response.body.preferences.dietaryRestrictions).toContain('Gluten');
        });
    });
});
