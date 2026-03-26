const express = require('express');
const router = express.Router();
// Klasör adının 'controllers' (s takılı) olduğundan emin ol!
const ctrlAuth = require('../controllers/AuthController');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;