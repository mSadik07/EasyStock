const express = require('express');
const app = express();
const port = 9000;

app.get('/', (req, res) => {
  res.send('🚀 EasyStock REST API Docker Üzerinde Sorunsuz Çalışıyor!');
});

app.listen(port, () => {
  console.log(`EasyStock API dinleniyor: http://localhost:${port}`);
});