const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    stockQuantity: { type: Number, default: 0 },
    buyPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    category: { type: String, default: "Genel" }
});

mongoose.model('Product', productSchema);