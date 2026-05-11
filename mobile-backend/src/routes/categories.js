const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

// GEREKSİNİM 9: Kategori Oluşturma
// POST /categories
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Kategori adı zorunludur.' });
    }

    const existing = await Category.findOne({ name, userId: req.user.userId });
    if (existing) {
      return res.status(409).json({ message: 'Bu kategori zaten mevcut.' });
    }

    const category = new Category({
      name,
      description: description || '',
      userId: req.user.userId
    });

    await category.save();
    res.status(201).json({ message: 'Kategori oluşturuldu.', category });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 9: Kategori Listeleme
// GET /categories
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.userId }).sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

module.exports = router;