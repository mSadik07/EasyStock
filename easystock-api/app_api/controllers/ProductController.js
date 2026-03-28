const mongoose = require('mongoose');
const Product = mongoose.model('Product');

// Gereksinim 4: Ürün Ekleme (Zaten vardı)
const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ status: "başarılı", message: "Ürün eklendi", product });
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};

// Gereksinim 5: Tüm Stokları Listeleme (YENİ EKLE!)
const listAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Veritabanındaki tüm ürünleri getir
        res.status(200).json({ 
            status: "başarılı", 
            count: products.length, 
            products 
        });
    } catch (err) {
        res.status(500).json({ status: "hata", error: err.message });
    }
};

// Gereksinim 6: Barkod Sorgulama (YENİ EKLE!)
const getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params; 
        const product = await Product.findOne({ barcode: barcode });
        
        // Sadece product'ı kontrol et, user burada yok!
        if (product) { 
            res.status(200).json({ status: "başarılı", product });
        } else {
            res.status(404).json({ status: "hata", message: "Bu barkoda ait ürün bulunamadı!" });
        }
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};

// Export kısmına getProductByBarcode ekle!
module.exports = { addProduct, listAllProducts, getProductByBarcode };

