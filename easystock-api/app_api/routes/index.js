const express = require('express');
const router = express.Router();
const ctrlAuth = require('../controllers/AuthController');
const ctrlProduct = require('../controllers/ProductController');

// Kullanıcı Yolları (Gereksinim 1, 2, 3)
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/profile/:userId', ctrlAuth.updateProfile);

// Ürün Yolları
router.post('/products', ctrlProduct.addProduct);           // Gereksinim 4
router.get('/products', ctrlProduct.listAllProducts);      // Gereksinim 5
router.get('/products/:barcode', ctrlProduct.getProductByBarcode); // Gereksinim 6 (YENİ EKLE!)
router.put('/products/:barcode', ctrlProduct.updateStock);  // Gereksinim 7 (YENİ EKLE!)
router.delete('/products/:barcode', ctrlProduct.deleteProduct); // Gereksinim 8 (YENİ EKLE!)
module.exports = router;