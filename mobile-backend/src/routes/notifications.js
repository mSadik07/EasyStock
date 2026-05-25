const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// GEREKSİNİM 14: Bildirim Yönetimi
// GET /notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .populate('productId', 'name stock')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false
    });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

// PUT /notifications/:id/read - Bildirimi okundu işaretle
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true }
    );
    res.status(200).json({ message: 'Bildirim okundu olarak işaretlendi.' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası.', error: error.message });
  }
});

module.exports = router;