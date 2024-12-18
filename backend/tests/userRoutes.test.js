const request = require('supertest');
const app = require('../app'); // Import your Express app
const User = require('../models/User');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from the shared .env file
dotenv.config({ path: '../.env' });


// Mock email transporter
jest.mock("nodemailer", () => {
    const nodemailerMock = require("nodemailer-mock");
    return {
        createTransport: nodemailerMock.createTransport,
        mock: nodemailerMock.mock, // Expose mock for accessing sent emails
    };
});

describe('User Routes', () => {
    const nodemailer = require("nodemailer"); // Import mocked nodemailer
    let testUser;
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
        // Reset mock email state
        nodemailer.mock.reset();
    });

    /**
     * Closes the database connection after all tests are complete.
     */
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a new user and should send an email with a verification link ', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Registration successful. Please verify your email.");

        // Check that an email was sent
        const sentEmails = nodemailer.mock.getSentMail(); // Access sent emails from mock
        expect(sentEmails.length).toBe(1);
        expect(sentEmails[0].to).toBe("john@example.com");
        expect(sentEmails[0].subject).toBe("Verify Your Email - FoodTrack");
        expect(sentEmails[0].html).toContain("Verify Email");
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

    it("should verify the user's email with a valid token", async () => {
        // Register a user and get the token
        await request(app)
            .post("/api/users/register")
            .send({
                name: "Verification Test",
                email: "verificationtest@example.com",
                password: "password123",
            });

        const sentEmails = nodemailer.mock.getSentMail();
        const verificationLink = sentEmails[0].html.match(/href="(.*?)"/)[1];
        const token = verificationLink.split("token=")[1];

        // Call the verify email endpoint
        const verifyResponse = await request(app).get(`/api/users/verify-email?token=${token}`);

        expect(verifyResponse.status).toBe(200);
        expect(verifyResponse.body.message).toBe("Email verified successfully. You can now log in.");

        // Ensure user is marked as verified in the database
        const user = await User.findOne({ email: "verificationtest@example.com" });
        expect(user.isVerified).toBe(true);
    });

    it("should not verify the user's email with an invalid token", async () => {
        const response = await request(app).get("/api/users/verify-email?token=invalidtoken");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid or expired token.");
    });

    it('should log in an existing user and return a token', async () => {
        const password = 'password123';
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name: 'John Doe', email: 'john@example.com', password: hashedPassword });
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

    it("should not verify an already verified email", async () => {
        const user = new User({
            name: "Already Verified User",
            email: "verifieduser@example.com",
            password: "password123",
            isVerified: true,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const response = await request(app).get(`/api/users/verify-email?token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email already verified.");
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
    
});

describe('PUT /api/users/profile', () => {
    let token;
    let testUploadDir

    /**
     * Connects to the test database.
     */
    beforeAll(async () => {
        const testDbUri = process.env.TEST_DB_URI;
        await mongoose.connect(testDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        testUploadDir = path.join(__dirname, "../uploads/profilePictures");
        if (!fs.existsSync(testUploadDir)) {
          fs.mkdirSync(testUploadDir, { recursive: true });
        }
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
        testUploadDir = path.join(__dirname, "../uploads/profilePictures");
        fs.rmdirSync(testUploadDir, { recursive: true });
    });

    beforeEach(async () => {
        const password = "password123";
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name: 'Test User', email: 'test@example.com', password: hashedPassword });
        await user.save();
        // Authenticate the user before each test
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        token = loginResponse.body.token;
    });

    it('should update the user profile successfully', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Updated User",
                preferences: "Vegan",
              });
        
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User profile updated successfully.");
      expect(res.body.user.name).toBe("Updated User");
      expect(res.body.user.preferences).toBe("Vegan");
    });

    it("should update the profile picture (file upload)", async () => {
        const res = await request(app)
          .put("/api/users/profile")
          .set("Authorization", `Bearer ${token}`)
          .attach(
            "profilePicture",
            path.join(__dirname, "test-files", "test-image.png")
          );
        
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User profile updated successfully.");
        expect(res.body.user.profilePicture).toContain("/uploads/profilePictures/");
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

describe("GET /api/users/profile", () => {
    let token;
    let user;
  
    beforeAll(async () => {
      // Connect to the test database
      await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const password = "password123";
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({  name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        preferences: "Vegetarian",
        profilePicture: "/uploads/profilePictures/john.png",
      });
      await user.save();
      // Authenticate the user before each test
      const loginResponse = await request(app)
          .post('/api/users/login')
          .send({ email: "john@example.com", password: 'password123' });

      token = loginResponse.body.token;

    });
  
    afterAll(async () => {
      // Cleanup: Remove test user and close the database connection
      await User.deleteMany();
      await mongoose.connection.close();
    });
  
    it("should return the user's profile when authenticated", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        name: "John Doe",
        email: "john@example.com",
        preferences: "Vegetarian",
        profilePicture: "/uploads/profilePictures/john.png",
      });
    });
  
    it("should return 401 if no token is provided", async () => {
      const response = await request(app).get("/api/users/profile");
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Access denied. No token provided." });
    });
  
    it("should return 403 if the token is invalid", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer invalidtoken");
  
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Invalid or expired token." });
    });
  
    // it("should return 404 if the user is not found", async () => {
    //   // Generate a token for a non-existent user
    //   const invalidUserToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
    //   const response = await request(app)
    //     .get("/api/users/profile")
    //     .set("Authorization", `Bearer ${invalidUserToken}`);

    //   console.log(response.body.message);
  
    //   expect(response.status).toBe(404);
    //   expect(response.body).toEqual({ message: "User not found." });
    // });
  
    // it("should return 500 on server error", async () => {
    //   // Mock the User.findById method to throw an error
    //   jest.spyOn(User, "findById").mockImplementationOnce(() => {
    //     throw new Error("Database error");
    //   });
  
    //   const response = await request(app)
    //     .get("/api/users/profile")
    //     .set("Authorization", `Bearer ${token}`);
      
    //   console.log(response.body.message);
    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ message: "Server error." });
  
    //   // Restore the original implementation
    //   User.findById.mockRestore();
    // });
});