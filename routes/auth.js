// Login
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// POST /api/auth/signup - create a new user account
router.post('/signup', userController.registerUser);

// POST /api/auth/login - authenticate and receive a JWT
router.post('/login', userController.loginUser);

module.exports = router;