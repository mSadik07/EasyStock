const express = require('express');
const app = express();
const port = 3000; // Frontend portu PDF'de 3000 olarak belirtilmiştir

app.get('/', (req, res) => {
  res.send(`
    <h1>📦 EasyStock Akıllı Envanter Yönetimi</h1>
    <p>Frontend arayüzü Docker üzerinde başarıyla çalışıyor!</p>
    <p>API Bağlantı Durumu: Bekleniyor...</p>
  `);
});

app.listen(port, () => {
  console.log(`EasyStock Frontend dinleniyor: http://localhost:${port}`);
});