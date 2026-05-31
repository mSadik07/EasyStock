const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  const uri = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
  
  let retries = 10;
  while (retries) {
    try {
      console.log(`RabbitMQ bağlantısı kuruluyor: ${uri}`);
      connection = await amqp.connect(uri);
      channel = await connection.createChannel();
      
      connection.on('error', (err) => {
        console.error('RabbitMQ Bağlantı Hatası:', err.message);
        setTimeout(connectRabbitMQ, 5000);
      });

      connection.on('close', () => {
        console.warn('RabbitMQ Bağlantısı Kapatıldı, yeniden bağlanılıyor...');
        setTimeout(connectRabbitMQ, 5000);
      });

      console.log('RabbitMQ Bağlantısı Başarıyla Kuruldu.');
      break;
    } catch (err) {
      console.error(`RabbitMQ Bağlantı Başarısız. Kalan deneme: ${retries - 1}. Hata: ${err.message}`);
      retries -= 1;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ kanalı henüz oluşturulmadı. Önce connectRabbitMQ çağrılmalıdır.');
  }
  return channel;
};

const publishToQueue = async (queueName, data) => {
  try {
    const ch = getChannel();
    await ch.assertQueue(queueName, { durable: true });
    ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
    console.log(`Mesaj [${queueName}] kuyruğuna gönderildi.`);
  } catch (error) {
    console.error('Mesaj kuyruğa gönderilirken hata oluştu:', error.message);
  }
};

const consumeQueue = async (queueName, callback) => {
  try {
    const ch = getChannel();
    await ch.assertQueue(queueName, { durable: true });
    await ch.prefetch(1);
    
    console.log(`[${queueName}] kuyruğu dinlenmeye başlandı...`);
    ch.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          ch.ack(msg);
        } catch (err) {
          console.error(`Kuyruk [${queueName}] mesaj işleme hatası:`, err.message);
          ch.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error('Kuyruk dinlenirken hata oluştu:', error.message);
  }
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  publishToQueue,
  consumeQueue
};
