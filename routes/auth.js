const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * Auth Routes
 * POST /api/auth/register  - Create a new user account
 * POST /api/auth/login     - Authenticate and receive JWT
 */
router.post('/register', register);
router.post('/login', login);

module.exports = router;
