const express = require('express');
const router = express.Router();
const ctrlProduct = require('../controllers/ProductController');
const ctrlAuth = require('../controllers/AuthController');

// --- ÜRÜN & ANALİZ ROTALARI ---
router.get('/products', ctrlProduct.getProducts);
router.post('/products', ctrlProduct.addProduct);
router.put('/products/:barcode', ctrlProduct.updateProduct);
router.delete('/products/:barcode', ctrlProduct.deleteProduct);
router.post('/sales', ctrlProduct.recordSale);
router.get('/system/dashboard', ctrlProduct.getDashboardSummary);
router.get('/analysis/inventory-value', ctrlProduct.getInventoryValue);
router.get('/system/backup', ctrlProduct.getBackup);

// --- KULLANICI ROTALARI ---
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.put('/users/:email', ctrlAuth.updateUser); // Profil Güncelleme Kapısı

module.exports = router;