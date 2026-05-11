const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GEREKSİNİM 1: Üye Olma
// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, businessName, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı, email ve şifre zorunludur.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Bu email veya kullanıcı adı zaten kayıtlı.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      businessName: businessName || '',
      phone: phone || ''
    });

    await user.save();

    res.status(201).json({
      message: 'Kayıt başarılı.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        businessName: user.businessName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 2: Giriş Yapma
// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Hatalı şifre.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Giriş başarılı.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        businessName: user.businessName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// GEREKSİNİM 3: Profil ve İşletme Güncelleme
// PUT /auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { businessName, phone, password } = req.body;
    const updateData = {};

    if (businessName) updateData.businessName = businessName;
    if (phone) updateData.phone = phone;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profil güncellendi.',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

module.exports = router;