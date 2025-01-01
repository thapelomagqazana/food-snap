const User = require('../../../models/User'); // Import User model
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const logger = require('../../../utils/logger'); // Import logger

// Register a new user
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Trim email 
        const trimmedEmail = email.trim();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // validate length
        if (trimmedEmail.length > 255) {
            return res.status(400).json({ message: 'Email cannot exceed 255 characters' });
        }

        if (name.length > 255) {
            return res.status(400).json({ message: 'Name cannot exceed 255 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new User({ name, email: trimmedEmail, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('Error during user registration:', error);
        next(error);
    }
};


// User login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const trimmedEmail = email.trim();
        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            logger.warn(`Login failed: No user found with email ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Login failed: Invalid password for email ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info(`User logged in successfully: ${email}`);
        res.status(200).json({ token, expiresIn: 3600 });
    } catch (error) {
        logger.error('Error during user login:', error);
        next(error); // Pass error to global error handler
    }
};

// Fetch user profile (protected route)
exports.getProfile = async (req, res, next) => {
    try {
        // User ID is extracted from the token by the middleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

        if (!user) {
            logger.warn(`Profile fetch failed: User not found with ID ${req.user.id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info(`User profile fetched successfully for ID: ${req.user.id}`);
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        next(error); // Pass error to global error handler
    }
};
