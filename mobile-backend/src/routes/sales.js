const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// GEREKSİNİM 13: Satış Kaydı Oluşturma
// POST /sales
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Ürün ID ve miktar zorunludur.' });
    }

    const product = await Product.findOne({
      _id: productId,
      userId: req.user.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Yetersiz stok.' });
    }

    // Stok düş
    product.stock -= parseInt(quantity);
    product.lastSaleDate = new Date();
    await product.save();

    // Satış kaydı oluştur
    const sale = new Sale({
      product: productId,
      quantity: parseInt(quantity),
      totalPrice: product.price * quantity,
      userId: req.user.userId
    });
    await sale.save();

    // Kritik stok kontrolü
    if (product.stock <= product.criticalStock) {
      const notification = new Notification({
        userId: req.user.userId,
        title: 'Kritik Stok Uyarısı',
        message: `${product.name} stoğu ${product.stock} adede düştü!`,
        type: 'low_stock',
        productId: product._id
      });
      await notification.save();
    }

    res.status(201).json({
      message: 'Satış kaydedildi.',
      sale,
      remainingStock: product.stock
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GET /sales - Satış listesi
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user.userId })
      .populate('product', 'name price barcode')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

module.exports = router;