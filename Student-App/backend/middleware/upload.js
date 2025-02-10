const multer = require('multer');

// Use memory storage to store the file in memory
const storage = multer.memoryStorage();

// Initialize multer upload instance with memory storage and file size limit
const upload = multer({
  storage,
  limits: {
    fileSize: 1000000  // Limit file size to 1MB (1000000 bytes)
  },
  fileFilter: (req, file, cb) => {
    // You can also add custom file filters here (e.g., checking file types)
    // For example, to accept only images:
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // allowed file types
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

module.exports = upload;  // Export the upload instance to use in other files
