const mongoose = require('mongoose');
const Product = mongoose.model('Product');

// Gereksinim 1: Stok Ömrü Tahminleme
const predictStockLife = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        const avgSales = 2.5; // Örn: Günlük ortalama 2.5 adet satılıyor (Analitik Motoru)
        const daysRemaining = Math.floor(product.stockQuantity / avgSales);

        res.status(200).json({
            productId: product._id,
            estimatedDaysRemaining: daysRemaining,
            message: daysRemaining < 5 ? "Kritik Stok: Sipariş Verilmeli!" : "Stok Yeterli"
        });
    } catch (err) {
        res.status(404).json({ message: "Ürün bulunamadı" });
    }
};

module.exports = { predictStockLife };
