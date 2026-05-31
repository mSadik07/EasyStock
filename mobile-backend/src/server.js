require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const analyticsRoutes = require('./routes/analytics');
const salesRoutes = require('./routes/sales');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Veritabanı ve Redis bağlantıları
connectDB();
const { connectRedis } = require('./config/redis');
connectRedis().catch(err => console.error('Redis bağlantı hatası:', err.message));

// RabbitMQ bağlantısı ve asenkron worker'ların başlatılması
const { connectRabbitMQ } = require('./config/rabbitmq');
const { startNotificationWorker } = require('./workers/notificationWorker');

connectRabbitMQ().then(() => {
  startNotificationWorker();
});

// Rotalar
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/sales', salesRoutes);
app.use('/notifications', notificationRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  res.json({ message: 'EasyStock API çalışıyor!', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EasyStock sunucusu ${PORT} portunda çalışıyor.`);
});