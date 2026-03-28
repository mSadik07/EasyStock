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
router.get('/products/:barcode', ctrlProduct.getProductByBarcode); // Gereksinim 6 
router.put('/products/:barcode', ctrlProduct.updateStock);  // Gereksinim 7 
router.delete('/products/:barcode', ctrlProduct.deleteProduct); // Gereksinim 8 
router.post('/sales', ctrlProduct.makeSale); // Gereksinim 9 
router.get('/category/:categoryName', ctrlProduct.getProductsByCategory); // Gereksinim 10
module.exports = router;