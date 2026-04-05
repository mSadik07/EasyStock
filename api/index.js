const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoUri = process.env.MONGODB_URI || 'mongodb://db:27017/easystock';

app.use(express.json());

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB Bağlantısı Başarılı'))
    .catch(err => console.log('❌ MongoDB Hatası:', err));

// Modeller
require('./app_api/models/User');
require('./app_api/models/Product');
require('./app_api/models/Sale');
require('./app_api/models/Activity');
// Rotalar
const apiRoutes = require('./app_api/routes/index');
app.use('/', apiRoutes);

module.exports = app;