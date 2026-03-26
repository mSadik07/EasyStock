const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 9000;

app.use(express.json());

mongoose.connect('mongodb://db:27017/EasyStockDB')
    .then(() => console.log("✅ MongoDB Bağlantısı Tamam"))
    .catch(err => console.log("❌ DB Hatası:", err));

// Klasör isimlerine dikkat!
require('./app_api/models/User');
const apiRoutes = require('./app_api/routes/index');

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`🚀 EasyStock API ${port} portunda ateşlendi!`);
});