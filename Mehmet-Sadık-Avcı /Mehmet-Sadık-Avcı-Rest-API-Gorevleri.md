# 🚀 EasyStock REST API Dokümantasyonu

Bu döküman, **EasyStock** projesinin backend uç noktalarını ve veri yapılarını senin verdiğin standartlara göre tanımlar.

---

## 🔐 1. Kullanıcı ve Yetkilendirme

### **1. Üye Olma**
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "email": "kullanici@example.com",
    "password": "Guvenli123!",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "businessName": "Sadık Usta Butik"
  }
Response: 201 Created - Kullanıcı başarıyla oluşturuldu.

2. Giriş Yapma
Endpoint: POST /auth/login

Request Body:

JSON
{
  "email": "kullanici@example.com",
  "password": "Guvenli123!"
}
Response: 200 OK - { "token": "eyJhbG..." } (JWT Token döner).

3. Profil ve İşletme Güncelleme
Endpoint: PUT /auth/profile

Request Body:

JSON
{
  "businessName": "Sadık Usta Yeni İşletme Adı",
  "phone": "0555..."
}
Response: 200 OK - Profil başarıyla güncellendi.

📦 2. Ürün ve Stok Yönetimi
4. Yeni Ürün Ekleme
Endpoint: POST /products

Request Body:

JSON
{
  "name": "Siyah Tişört L Beden",
  "barcode": "8691234567",
  "categoryId": "101",
  "stockQuantity": 50,
  "buyPrice": 120.00,
  "sellPrice": 250.00,
  "minStockLevel": 10
}
Response: 201 Created - Ürün başarıyla eklendi.

5. Stok Listeleme
Endpoint: GET /products

Response: 200 OK - Ürün listesi (Array) döner.

6. Ürün ve Barkod Detayı
Endpoint: GET /products/barcode/{barcode}

Response: 200 OK - Belirli ürüne ait JSON verisi döner.

7. Stok Miktarı Güncelleme (Manuel)
Endpoint: PATCH /products/{id}/stock

Request Body: ```json
{
"adjustment": 15
}

Response: 200 OK - Güncel stok miktarı döner.

8. Ürün Silme
Endpoint: DELETE /products/{id}

Response: 204 No Content - Ürün başarıyla silindi.

9. Kategori Yönetimi
Endpoint: POST /categories

Request Body: ```json
{
"name": "Giyim"
}

Response: 201 Created - Kategori oluşturuldu.

🧠 3. Akıllı Analiz ve Tahminleme (Madde 1)
10. Akıllı Kritik Stok Listesi
Endpoint: GET /analytics/low-stock

Response: 200 OK - Bitmeye yaklaşan ve kritik seviye altındaki ürünler döner.

11. Stok Ömrü Tahminleme
Endpoint: GET /analytics/predict/{id}

Response: 200 OK - { "estimatedDays": 12, "predictionDate": "2026-03-20" }

12. Ölü Stok Analizi
Endpoint: GET /analytics/dead-stock

Response: 200 OK - Son 30 gündür satılmayan ürünlerin listesi.

🛒 4. Satış ve Sistem İşlemleri
13. Satış Kaydı Oluşturma
Endpoint: POST /sales

Request Body:

JSON
{
  "productId": "505",
  "quantity": 2,
  "totalPrice": 500.00,
  "paymentMethod": "Credit Card"
}
Response: 201 Created - Satış kaydedildi, stok otomatik düştü.

14. Bildirim Yönetimi
Endpoint: GET /notifications

Response: 200 OK - Okunmamış stok uyarıları listesi döner.

15. Veri Dışa Aktarma (Export)
Endpoint: GET /reports/export

Response: 200 OK - İndirilebilir dosya bağlantısı veya stream döner.
