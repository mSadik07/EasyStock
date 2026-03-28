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
// Gereksinim 7: Manuel Stok Güncelleme (YENİ EKLE!)
const updateStock = async (req, res) => {
    try {
        const { barcode } = req.params; // Güncellenecek ürünün barkodu URL'den gelir
        const { newQuantity } = req.body; // Yeni stok miktarı Body'den gelir

        const product = await Product.findOneAndUpdate(
            { barcode: barcode }, 
            { stockQuantity: newQuantity }, 
            { new: true } // Güncellenmiş halini geri döndür
        );

        if (product) {
            res.status(200).json({ 
                status: "başarılı", 
                message: "Stok miktarı güncellendi!", 
                product: { name: product.name, stockQuantity: product.stockQuantity } 
            });
        } else {
            res.status(404).json({ status: "hata", message: "Ürün bulunamadı!" });
        }
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};
// Gereksinim 8: Ürün Silme (YENİ EKLE!)
const deleteProduct = async (req, res) => {
    try {
        const { barcode } = req.params; // Silinecek ürünün barkodu URL'den gelir

        const result = await Product.findOneAndDelete({ barcode: barcode });

        if (result) {
            res.status(200).json({ 
                status: "başarılı", 
                message: `${result.name} isimli ürün envanterden silindi!` 
            });
        } else {
            res.status(404).json({ status: "hata", message: "Silinecek ürün bulunamadı!" });
        }
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};
// Gereksinim 9: Satış Kaydı Oluşturma (YENİ EKLE!)
const makeSale = async (req, res) => {
    try {
        const { barcode, quantity } = req.body; // Satılan ürünün barkodu ve adedi

        // 1. Ürünü bul
        const product = await Product.findOne({ barcode: barcode });

        if (!product) {
            return res.status(404).json({ status: "hata", message: "Ürün bulunamadı!" });
        }

        // 2. Stok yeterli mi kontrol et
        if (product.stockQuantity < quantity) {
            return res.status(400).json({ status: "hata", message: "Yetersiz stok!" });
        }

        // 3. Stoğu düş ve güncelle
        product.stockQuantity -= quantity;
        await product.save();

        res.status(200).json({ 
            status: "başarılı", 
            message: "Satış tamamlandı, stok güncellendi!", 
            remainingStock: product.stockQuantity,
            totalPrice: product.sellPrice * quantity 
        });
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};
// Gereksinim 10: Kategori Yönetimi (YENİ EKLE!)
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params; // Kategori adı URL'den gelir

        // Büyük/küçük harf duyarlılığını ortadan kaldırmak için RegExp kullanıyoruz
        const products = await Product.find({ 
            category: { $regex: new RegExp(categoryName, "i") } 
        });

        if (products.length > 0) {
            res.status(200).json({ 
                status: "başarılı", 
                category: categoryName,
                count: products.length, 
                products 
            });
        } else {
            res.status(404).json({ status: "hata", message: "Bu kategoride ürün bulunamadı!" });
        }
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};

// Export kısmını son haliyle GÜNCELLE!
module.exports = { 
    addProduct, 
    listAllProducts, 
    getProductByBarcode, 
    updateStock, 
    deleteProduct, 
    makeSale,
    getProductsByCategory // Bunu ekledik
};
// Gereksinim 11: Kritik Stok Seviyesi Uyarısı (YENİ EKLE!)
const getCriticalStock = async (req, res) => {
    try {
        const limit = 5; // Kritik eşik değeri (5 ve altı)
        
        // Stok miktarı 5'ten küçük veya eşit olanları bul ($lte = Less Than or Equal)
        const criticalProducts = await Product.find({ 
            stockQuantity: { $lte: limit } 
        });

        res.status(200).json({ 
            status: "başarılı", 
            alert: "Aşağıdaki ürünlerin stoğu kritik seviyededir!",
            count: criticalProducts.length, 
            products: criticalProducts 
        });
    } catch (err) {
        res.status(500).json({ status: "hata", error: err.message });
    }
};

// Export kısmını son haliyle GÜNCELLE!
module.exports = { 
    addProduct, 
    listAllProducts, 
    getProductByBarcode, 
    updateStock, 
    deleteProduct, 
    makeSale,
    getProductsByCategory,
    getCriticalStock // Bunu ekledik
};

// Export kısmını son haliyle güncelle!
module.exports = { addProduct, listAllProducts, getProductByBarcode, updateStock, deleteProduct, makeSale, getProductsByCategory, getCriticalStock };

