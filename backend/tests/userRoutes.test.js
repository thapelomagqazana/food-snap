const request = require('supertest');
const app = require('../app'); // Import your Express app
const User = require('../models/User');
const bcrypt = require("bcrypt");

describe('User Routes', () => {
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
