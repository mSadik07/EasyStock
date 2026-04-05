const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. CORS'u çağırdık
const app = express();
const mongoUri = process.env.MONGODB_URI || 'mongodb://db:27017/easystock';

const allowedOrigins = [
    'https://easystock-frontend-sigma.vercel.app',
    'https://easystock-api.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy violation: origin not allowed.'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Preflight istekleri cevaplayalım
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