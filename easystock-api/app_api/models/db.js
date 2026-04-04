const mongoose = require('mongoose');
// Docker servis ismin "db" olduğu için burası db:27017 olmalı kral
const dbURI = 'mongodb://db:27017/easystock';

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => console.log('✅ MongoDB Bağlandı!'));
mongoose.connection.on('error', (err) => console.log('❌ Bağlantı Hatası: ' + err));

require('./User');
require('./Product');
require('./Sale');