const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 9000;

app.use(express.json());

mongoose.connect('mongodb://db:27017/EasyStockDB')
    .then(() => console.log("✅ MongoDB Bağlantısı Başarılı"))
    .catch(err => console.log("❌ MongoDB Hatası:", err));

// Modelleri Kaydet (Sıralama önemli)
require('./app_api/models/User');
require('./app_api/models/Product');

// Rotaları Bağla
const apiRoutes = require('./app_api/routes/index');
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`🚀 EasyStock API http://localhost:${port} adresinde hazır!`);
});