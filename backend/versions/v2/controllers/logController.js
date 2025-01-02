const Log = require('../../../models/Log');
const logger = require('../../../utils/logger');
const moment = require('moment');
const mongoose = require("mongoose");

// Create a new meal log
exports.createLog = async (req, res, next) => {
    try {
        const { mealTime, items } = req.body;

        if (!mealTime || !items || items.length === 0) {
            logger.warn('Meal log creation failed: Missing mealTime or items');
            return res.status(400).json({ message: 'mealTime and items are required' });
        }

        if (mealTime.length > 255) {
            logger.warn('Meal log creation failed: mealTime exceeds maximum length');
            return res.status(400).json({ message: 'mealTime exceeds maximum allowed length' });
        }

        if (!items.every(item => item.name && item.calories && item.protein && item.carbs && item.fat)) {
            logger.warn('Meal log creation failed: Invalid item structure');
            return res.status(400).json({ message: 'Each item must include name, calories, protein, carbs, and fat' });
        }
        
        // Create a new log entry
        const newLog = new Log({
            userId: req.user.id, // User ID from token
            mealTime,
            items,
        });

        await newLog.save();

        logger.info(`Meal log created successfully for user ${req.user.id}`);
        res.status(201).json({ message: 'Meal log created successfully', log: newLog });
    } catch (error) {
        logger.error('Error creating meal log:', error);
        next(error); // Pass error to global error handler
    }
};

// Get daily meal logs for the authenticated user
exports.getDailyLogs = async (req, res, next) => {
    try {
        const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

        const logs = await Log.find({
            userId: req.user.id,
            createdAt: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) },
        });

        logger.info(`Fetched daily logs for user ${req.user.id}`);
        res.status(200).json({ logs });
    } catch (error) {
        logger.error('Error fetching daily logs:', error);
        next(error); // Pass error to global error handler
    }
};

// Get meal logs by date
exports.getLogsByDate = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            logger.warn('Meal log fetch failed: Missing date parameter');
            return res.status(400).json({ message: 'Date query parameter is required' });
        }

        // Validate date format
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            logger.warn('Meal log fetch failed: Invalid date format');
            return res.status(400).json({ message: 'Invalid date format. Expected format is YYYY-MM-DD' });
        }

        const logs = await Log.find({
            userId: req.user.id,
            createdAt: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) },
        });

        logger.info(`Fetched logs for user ${req.user.id} on date ${date}`);
        res.status(200).json({ logs });
    } catch (error) {
        logger.error('Error fetching logs by date:', error);
        next(error); // Pass error to global error handler
    }
};
// Delete a meal log
exports.deleteLog = async (req, res, next) => {
    try {
        const { logId } = req.params;

        // Validate logId format
        if (!mongoose.Types.ObjectId.isValid(logId)) {
            logger.warn(`Invalid logId format: ${logId}`);
            return res.status(400).json({ message: 'Invalid logId format' });
        }

        const log = await Log.findOneAndDelete({ _id: logId, userId: req.user.id });

        if (!log) {
            logger.warn(`Meal log deletion failed: Log not found for ID ${logId}`);
            return res.status(404).json({ message: 'Log not found' });
        }

        logger.info(`Meal log deleted successfully for ID ${logId}`);
        res.status(200).json({ message: 'Meal log deleted successfully' });
    } catch (error) {
        logger.error('Error deleting meal log:', error);
        next(error); // Pass error to global error handler
    }
};
