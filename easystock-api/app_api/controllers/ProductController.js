const mongoose = require('mongoose');
const Product = mongoose.model('Product');

const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ status: "başarılı", message: "Ürün eklendi", product });
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};

module.exports = { addProduct };