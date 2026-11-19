const express = require('express');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post('/api/auth/register', validate('register'), authController.register);
router.post('/api/auth/login', validate('login'), authController.login);

module.exports = router;
