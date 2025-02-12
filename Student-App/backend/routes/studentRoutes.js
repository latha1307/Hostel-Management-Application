const express = require("express");
const multer = require('multer');
const { registerStudent } = require('../controllers/studentController');
const upload = require('../utils/fileUtils');

const router = express.Router();

// Route for new student registration
router.post('/new-register', upload, registerStudent);
// Route for student login


module.exports = router;
