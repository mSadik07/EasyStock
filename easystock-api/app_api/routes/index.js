const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/AuthController');
const ctrlProduct = require('../controllers/ProductController');

// Kullanıcı Yolları
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/profile/:userId', ctrlAuth.updateProfile);

// Ürün Yolları
router.post('/products', ctrlProduct.addProduct);

module.exports = router;