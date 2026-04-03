const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productBarcode: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now }
});

mongoose.model('Sale', saleSchema);