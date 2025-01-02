const express = require('express');
const { createLog, getDailyLogs, getLogsByDate, deleteLog } = require('../controllers/logController');
const { authMiddleware } = require('../../../middleware/authMiddleware');

const router = express.Router();

// Route to create a new meal log
router.post('/', authMiddleware, createLog);

// Route to get daily logs
router.get('/daily', authMiddleware, getDailyLogs);

// Route to get logs by a specific date
router.get('/', authMiddleware, getLogsByDate);

// Route to delete a specific meal log
router.delete('/:logId', authMiddleware, deleteLog);

module.exports = router;
