const express = require('express');
const { login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', login);  // POST /api/auth for login
router.get('/', protect, getMe);  // GET /api/auth for getting current user

module.exports = router;