const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. CORS'u çağırdık
const app = express();
const port = process.env.PORT || 9001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/easystock';

app.use(cors({ origin: true, credentials: true })); // 2. Kapıları tüm tarayıcılara açtık
app.options('*', cors());
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
app.use('/api', apiRoutes);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 API Hazır: http://localhost:${port}`);
    });
}

module.exports = app;