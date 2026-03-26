const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/AuthController');

// Gereksinim 1, 2 & 3 Yolları
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/profile/:userId', ctrlAuth.updateProfile); // Profil güncelleme yolu

module.exports = router;