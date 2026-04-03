const express = require('express');
const router = express.Router();
const ctrlProduct = require('../controllers/ProductController');
const ctrlAuth = require('../controllers/AuthController');

// Ürün Rotaları
router.get('/products', ctrlProduct.getProducts);
router.post('/products', ctrlProduct.addProduct);
router.put('/products/:barcode', ctrlProduct.updateProduct);
router.delete('/products/:barcode', ctrlProduct.deleteProduct);

// Satış & Analiz
router.post('/sales', ctrlProduct.recordSale);
router.get('/system/dashboard', ctrlProduct.getDashboardSummary);
router.get('/analysis/inventory-value', ctrlProduct.getInventoryValue);
router.get('/system/backup', ctrlProduct.getBackup);
router.get('/sales/report', ctrlProduct.getSalesReport);

// Auth Rotaları
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;