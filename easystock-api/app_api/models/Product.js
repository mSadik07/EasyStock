const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    stockQuantity: { type: Number, default: 0 },
    buyPrice: Number,
    sellPrice: Number,
    minStockLevel: { type: Number, default: 5 }, // Kritik stok uyarısı için
    category: String,
    lastSaleDate: Date
});

mongoose.model('Product', productSchema);