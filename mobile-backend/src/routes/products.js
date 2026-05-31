const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const { getCache, setCache, clearUserCache } = require('../config/redis');

// GEREKSİNİM 4: Yeni Ürün Ekleme
// POST /products
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, barcode, price, stock, criticalStock, category } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Ürün adı, fiyat ve stok zorunludur.' });
    }

    const product = new Product({
      name,
      barcode: barcode || '',
      price,
      stock,
      criticalStock: criticalStock || 5,
      category: category || null,
      userId: req.user.userId
    });

    await product.save();

    // Kritik stok kontrolü
    if (product.stock <= product.criticalStock) {
      const notification = new Notification({
        userId: req.user.userId,
        title: 'Kritik Stok Uyarısı',
        message: `${product.name} ürününün stoğu kritik seviyede! (${product.stock} adet)`,
        type: 'low_stock',
        productId: product._id
      });
      await notification.save();
    }

    // Yeni ürün eklendiği için kullanıcının ürün önbelleğini temizle
    await clearUserCache(req.user.userId);

    res.status(201).json({ message: 'Ürün eklendi.', product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 5: Stok Listeleme
// GET /products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const cacheKey = `user:${req.user.userId}:products:search:${search || ''}:cat:${category || ''}:p:${page}:l:${limit}`;

    // Önce Redis cache kontrol et
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log('Redis: Ürün listesi önbellekten getirildi.');
      return res.status(200).json(cachedData);
    }

    const filter = { userId: req.user.userId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    const responseData = {
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };

    // Sorgu sonucunu Redis cache'e kaydet (5 dakika)
    await setCache(cacheKey, responseData, 300);

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 6: Ürün ve Barkod Detayı
// GET /products/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GET /products/barcode/:code
router.get('/barcode/:code', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.code,
      userId: req.user.userId
    }).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Bu barkoda ait ürün bulunamadı.' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 7: Stok Miktarı Güncelleme
// PUT /products/:id/stock
router.put('/:id/stock', authMiddleware, async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    // operation: 'add' (mal kabul) veya 'subtract' (fire/düzeltme)

    if (quantity === undefined || !operation) {
      return res.status(400).json({ message: 'Miktar ve işlem türü zorunludur.' });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    if (operation === 'add') {
      product.stock += parseInt(quantity);
    } else if (operation === 'subtract') {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Yetersiz stok.' });
      }
      product.stock -= parseInt(quantity);
    } else {
      return res.status(400).json({ message: 'Geçersiz işlem türü. "add" veya "subtract" kullanın.' });
    }

    await product.save();

    // Kritik stok bildirimi
    if (product.stock <= product.criticalStock) {
      const existingNotif = await Notification.findOne({
        userId: req.user.userId,
        productId: product._id,
        type: 'low_stock',
        isRead: false
      });

      if (!existingNotif) {
        const notification = new Notification({
          userId: req.user.userId,
          title: 'Kritik Stok Uyarısı',
          message: `${product.name} ürününün stoğu kritik seviyede! (${product.stock} adet)`,
          type: 'low_stock',
          productId: product._id
        });
        await notification.save();
      }
    }

    // Stok güncellendiği için kullanıcının ürün önbelleğini temizle
    await clearUserCache(req.user.userId);

    res.status(200).json({ message: 'Stok güncellendi.', product });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 8: Ürün Silme
// DELETE /products/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Ürün silindiği için kullanıcının ürün önbelleğini temizle
    await clearUserCache(req.user.userId);

    res.status(200).json({ message: 'Ürün silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

module.exports = router;