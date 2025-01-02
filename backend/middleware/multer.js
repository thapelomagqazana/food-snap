const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory for testing
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 10 MB limit
});

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'File too large' });
        }
    }
    next(err);
};

module.exports = { upload, multerErrorHandler };
