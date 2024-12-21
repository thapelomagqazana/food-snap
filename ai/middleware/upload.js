const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Store files temporarily in 'uploads/'

module.exports = upload;
