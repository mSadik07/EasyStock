const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { consumeQueue } = require('../config/rabbitmq');

const startNotificationWorker = async () => {
  try {
    await consumeQueue('sale_events', async (data) => {
      const { productId, quantity, userId } = data;
      console.log(`Worker: Yeni satış işleniyor. Ürün ID: ${productId}, Miktar: ${quantity}`);

      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`Worker Uyarı: Ürün bulunamadı (ID: ${productId})`);
        return;
      }

      console.log(`Worker: Ürün Stoğu: ${product.stock}, Kritik Limit: ${product.criticalStock}`);

      if (product.stock <= product.criticalStock) {
        const notification = new Notification({
          userId: userId,
          title: 'Kritik Stok Uyarısı (RabbitMQ)',
          message: `${product.name} stoğu ${product.stock} adede düştü! (Asenkron kontrol edildi)`,
          type: 'low_stock',
          productId: product._id
        });
        await notification.save();
        console.log(`Worker Başarılı: Kritik stok bildirimi veritabanına kaydedildi.`);
      }
    });
  } catch (error) {
    console.error('Notification Worker başlatılırken hata oluştu:', error.message);
  }
};

module.exports = {
  startNotificationWorker
};
