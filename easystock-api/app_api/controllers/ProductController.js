const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Sale = mongoose.model('Sale');

// 1. Tüm Ürünleri Getir
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "başarılı", products });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 2. Yeni Ürün Ekle
const addProduct = async (req, res) => {
    try {
        const { barcode, name, category, stockQuantity, buyPrice, sellPrice } = req.body;
        const product = await Product.create({
            barcode,
            name,
            category,
            stockQuantity: Number(stockQuantity) || 0,
            buyPrice: Number(buyPrice) || 0,
            sellPrice: Number(sellPrice) || 0
        });
        res.status(201).json({ status: "başarılı", product });
    } catch (err) {
        res.status(400).json({ message: err.message || "Ürün eklenirken hata oluştu." });
    }
};

// 3. Stok Güncelle (+)
const updateProduct = async (req, res) => {
    try {
        const { stockQuantity } = req.body;
        const product = await Product.findOne({ barcode: req.params.barcode });
        if (product) {
            product.stockQuantity += Number(stockQuantity);
            await product.save();
            res.status(200).json({ status: "başarılı" });
        }
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 4. Satış Yap & Kaydet
const recordSale = async (req, res) => {
    try {
        const { barcode, quantity } = req.body;
        const product = await Product.findOne({ barcode });
        if (!product || product.stockQuantity < quantity) return res.status(400).json({ message: "Yetersiz stok!" });

        product.stockQuantity -= Number(quantity);
        await product.save();

        await Sale.create({
            productBarcode: barcode,
            productName: product.name,
            quantity: Number(quantity),
            totalPrice: product.sellPrice * quantity
        });
        res.status(200).json({ status: "başarılı" });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 5. Ürün Sil
const deleteProduct = async (req, res) => {
    try {
        await Product.deleteOne({ barcode: req.params.barcode });
        res.status(200).json({ status: "başarılı" });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 6. Dashboard Özetleri
const getDashboardSummary = async (req, res) => {
    try {
        const products = await Product.find();
        const critical = products.filter(p => p.stockQuantity <= 5).length;
        res.status(200).json({ dashboard: { inventoryDiversity: products.length, criticalAlerts: critical } });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 7. Envanter Değeri
const getInventoryValue = async (req, res) => {
    try {
        const products = await Product.find();
        const total = products.reduce((sum, p) => sum + (p.stockQuantity * p.sellPrice), 0);
        res.status(200).json({ summary: { potentialTotalRevenue: total } });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// 8. Yedekleme (JSON)
const getBackup = async (req, res) => {
    try {
        const products = await Product.find();
        const sales = await Sale.find();
        res.status(200).json({ products, sales });
    } catch (err) { res.status(400).json({ message: err.message }); }
};
const getSalesReport = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ saleDate: -1 }); // En son satış en üstte
        
        let totalRevenue = 0;
        let totalItemsSold = 0;

        sales.forEach(s => {
            totalRevenue += s.totalPrice;
            totalItemsSold += s.quantity;
        });

        res.status(200).json({ 
            status: "başarılı", 
            sales, 
            summary: { totalRevenue, totalItemsSold } 
        });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct, recordSale, getDashboardSummary, getInventoryValue, getBackup, getSalesReport };