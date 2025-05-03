const express = require('express');
const { register, updateProfile, changePassword } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', register);  // This is the missing registration route!

// Protected routes
router.put('/profile', protect, updateProfile);
router.put('/changepassword', protect, changePassword);

module.exports = router;
