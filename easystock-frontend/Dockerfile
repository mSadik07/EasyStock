# 1. Temel imajı belirle
FROM node:latest

# 2. Çalışma dizinini ayarla
WORKDIR /app

# 3. Bağımlılıkları kopyala ve yükle
COPY package.json ./
RUN npm install

# 4. Kaynak kodları kopyala
COPY . .

# 5. Frontend portunu (3000) dışarı aç
EXPOSE 3000

# 6. Uygulamayı başlat
CMD ["npm", "start"]