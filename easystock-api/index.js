const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. CORS'u çağırdık
const app = express();
const port = 9000;

app.use(cors()); // 2. Kapıları tüm tarayıcılara açtık
app.use(express.json());

mongoose.connect('mongodb://db:27017/EasyStockDB')
    .then(() => console.log("✅ MongoDB Bağlantısı Başarılı"))
    .catch(err => console.log("❌ MongoDB Hatası:", err));

// Modeller
require('./app_api/models/User');
require('./app_api/models/Product');

// Rotalar
const apiRoutes = require('./app_api/routes/index');
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`🚀 API Hazır: http://localhost:${port}`);
});