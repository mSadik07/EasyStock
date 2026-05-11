const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// GEREKSİNİM 10: Akıllı Kritik Stok Listesi
// GET /analytics/low-stock
router.get('/low-stock', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.userId });
    const lowStockProducts = [];

    for (const product of products) {
      if (product.stock <= product.criticalStock) {
        lowStockProducts.push({
          ...product.toObject(),
          status: 'critical',
          message: `Stok kritik seviyede: ${product.stock} adet kaldı.`
        });
      }
    }

    // Satış hızına göre "bitmek üzere" tahminini ekle
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const product of products) {
      if (product.stock > product.criticalStock) {
        const sales = await Sale.find({
          product: product._id,
          createdAt: { $gte: thirtyDaysAgo }
        });

        const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0);
        const dailyRate = totalSold / 30;

        if (dailyRate > 0) {
          const daysLeft = product.stock / dailyRate;
          if (daysLeft <= 7) {
            lowStockProducts.push({
              ...product.toObject(),
              status: 'predicted',
              daysLeft: Math.round(daysLeft),
              message: `Tahminen ${Math.round(daysLeft)} gün içinde bitecek.`
            });
          }
        }
      }
    }

    lowStockProducts.sort((a, b) => (a.stock - b.stock));

    res.status(200).json({ lowStockProducts, count: lowStockProducts.length });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 11: Stok Ömrü Tahminleme
// GET /analytics/predict/:id
router.get('/predict/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Son 30 günlük satışları al
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Sale.find({
      product: product._id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0);
    const dailySaleRate = totalSold / 30;

    let prediction = {};

    if (dailySaleRate === 0) {
      prediction = {
        productId: product._id,
        productName: product.name,
        currentStock: product.stock,
        dailySaleRate: 0,
        estimatedDaysLeft: null,
        message: 'Son 30 günde satış verisi bulunamadı. Tahmin yapılamıyor.'
      };
    } else {
      const daysLeft = Math.floor(product.stock / dailySaleRate);
      prediction = {
        productId: product._id,
        productName: product.name,
        currentStock: product.stock,
        dailySaleRate: parseFloat(dailySaleRate.toFixed(2)),
        estimatedDaysLeft: daysLeft,
        estimatedEmptyDate: new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000),
        message: `Bu ürün mevcut satış hızıyla yaklaşık ${daysLeft} gün daha yetecek.`
      };
    }

    res.status(200).json({ prediction });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 12: Ölü Stok Analizi
// GET /analytics/dead-stock
router.get('/dead-stock', authMiddleware, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const products = await Product.find({ userId: req.user.userId });
    const deadStockProducts = [];

    for (const product of products) {
      const recentSale = await Sale.findOne({
        product: product._id,
        createdAt: { $gte: thirtyDaysAgo }
      });

      if (!recentSale && product.stock > 0) {
        const daysSinceLastSale = product.lastSaleDate
          ? Math.floor((Date.now() - product.lastSaleDate) / (1000 * 60 * 60 * 24))
          : null;

        deadStockProducts.push({
          ...product.toObject(),
          daysSinceLastSale,
          message: daysSinceLastSale
            ? `Bu ürün ${daysSinceLastSale} gündür satılmadı.`
            : 'Bu ürün hiç satılmadı.'
        });
      }
    }

    res.status(200).json({ deadStockProducts, count: deadStockProducts.length });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

module.exports = router;