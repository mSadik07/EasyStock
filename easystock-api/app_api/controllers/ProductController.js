const mongoose = require('mongoose');
const Product = mongoose.model('Product');

// --- ÜRÜN İŞLEMLERİ ---

// Req 5 & 10: Ürün Listeleme ve Kategori Filtreleme
const getProducts = async (req, res) => {
    try {
        const { category } = req.params;
        const query = category ? { category: category } : {};
        const products = await Product.find(query);
        res.status(200).json({ status: "başarılı", products });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Req 4: Yeni Ürün Ekleme
const addProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ status: "başarılı", product: newProduct });
    } catch (err) {
        res.status(400).json({ status: "hata", message: "Barkod zaten kayıtlı olabilir!" });
    }
};

// Req 7: Stok Güncelleme (Miktarın üzerine ekler)
const updateProduct = async (req, res) => {
    try {
        const { barcode } = req.params;
        const { stockQuantity } = req.body;
        const product = await Product.findOne({ barcode });
        if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

        product.stockQuantity += Number(stockQuantity);
        await product.save();
        res.status(200).json({ status: "başarılı", product });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Req 8: Ürün Silme
const deleteProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({ barcode: req.params.barcode });
        res.status(200).json({ status: "başarılı", message: "Ürün silindi" });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// --- SATIŞ VE ANALİZ ---

// Req 9: Satış Kaydı (Stoktan düşer)
const recordSale = async (req, res) => {
    try {
        const { barcode, quantity } = req.body;
        const product = await Product.findOne({ barcode });
        if (!product || product.stockQuantity < quantity) {
            return res.status(400).json({ status: "hata", message: "Yetersiz stok!" });
        }
        product.stockQuantity -= Number(quantity);
        await product.save();
        res.status(200).json({ status: "başarılı", message: "Satış yapıldı" });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Req 15 & 11: Dashboard Özeti (Kritik Stok Dahil)
const getDashboardSummary = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const criticalAlerts = await Product.countDocuments({ stockQuantity: { $lte: 5 } });
        res.status(200).json({ 
            status: "başarılı", 
            dashboard: { inventoryDiversity: totalProducts, criticalAlerts: criticalAlerts } 
        });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Req 12: Finansal Özet (Envanter Değeri)
const getInventoryValue = async (req, res) => {
    try {
        const products = await Product.find();
        let totalValue = 0;
        products.forEach(p => { totalValue += (p.sellPrice * p.stockQuantity); });
        res.status(200).json({ status: "başarılı", summary: { potentialTotalRevenue: totalValue } });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Req 14: En Son Eklenen 5 Ürün
const getLastProducts = async (req, res) => {
    try {
        const lastProducts = await Product.find().sort({ _id: -1 }).limit(5);
        res.status(200).json({ status: "başarılı", products: lastProducts });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Req 13: Yedekleme (Tüm veriyi JSON olarak döner)
const getBackup = async (req, res) => {
    try {
        const allData = await Product.find();
        res.status(200).json({ status: "başarılı", backup: allData, date: new Date() });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// --- DIŞA AKTARMA ---
module.exports = {
    getProducts, addProduct, updateProduct, deleteProduct,
    recordSale, getDashboardSummary, getInventoryValue,
    getLastProducts, getBackup
};