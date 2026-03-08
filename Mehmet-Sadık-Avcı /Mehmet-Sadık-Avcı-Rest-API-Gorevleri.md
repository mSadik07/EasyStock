# 🚀 EasyStock REST API Dokümantasyonu

Bu döküman, **EasyStock (Küçük İşletme Stok ve Kritik Seviye Uyarıcı)** projesinin backend uç noktalarını (endpoints) ve veri yapılarını tanımlar.

---

## 🔐 1. Kullanıcı ve Yetkilendirme

### **1. Üye Olma**
* **Endpoint:** `POST /auth/register`
* **Açıklama:** Yeni kullanıcı hesabı oluşturur.
* **Request Body:**
```json
{
  "email": "kullanici@example.com",
  "password": "Guvenli123!",
  "businessName": "Sadık Usta Butik",
  "fullName": "Sadık Yılmaz"
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
Response: 200 OK - { "token": "eyJhbG..." }

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

Request Body: { "adjustment": 15 }

Response: 200 OK - Güncel stok miktarı döner.

8. Ürün Silme
Endpoint: DELETE /products/{id}

Response: 204 No Content - Ürün başarıyla silindi.

9. Kategori Yönetimi
Endpoint: POST /categories

Request Body: { "name": "Giyim" }

Response: 201 Created - Kategori oluşturuldu.

📊 3. Akıllı Analiz ve Tahminleme
10. Akıllı Kritik Stok Listesi
Endpoint: GET /analytics/low-stock

Açıklama: Bitmeye yaklaşan ve kritik seviye altındaki ürünleri listeler.

Response: 200 OK

11. Stok Ömrü Tahminleme
Endpoint: GET /analytics/predict/{id}

Response: 200 OK - { "estimatedDays": 12, "predictionDate": "2026-03-20" }

12. Ölü Stok Analizi
Endpoint: GET /analytics/dead-stock

Açıklama: Son 30 gündür satılmayan ürünlerin listesini döndürür.

Response: 200 OK

🛒 4. Satış ve Sistem
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

Açıklama: Okunmamış stok uyarıları listesini döndürür.

Response: 200 OK
