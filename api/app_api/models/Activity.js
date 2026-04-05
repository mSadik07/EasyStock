const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    action: { type: String, required: true }, // Örn: "Satış", "Ürün Ekleme"
    details: { type: String }, // Örn: "10 adet Elma satıldı"
    date: { type: Date, default: Date.now }
});

mongoose.model('Activity', activitySchema);