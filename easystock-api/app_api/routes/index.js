const express = require('express');
const router = express.アプリ.router();
const ctrlProducts = require('../controllers/ProductController');

// Gereksinim 1 için endpoint
router.get('/predict/:productId', ctrlProducts.predictStockLife);

module.exports = router;