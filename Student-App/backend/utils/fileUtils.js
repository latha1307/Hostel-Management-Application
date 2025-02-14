const multer = require('multer');

// Set up multer storage to store files in memory
const storage = multer.memoryStorage(); // Use memory storage instead of disk

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
};

// Set up multer with memory storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file'); // .single('file') for single file upload

module.exports = upload;
