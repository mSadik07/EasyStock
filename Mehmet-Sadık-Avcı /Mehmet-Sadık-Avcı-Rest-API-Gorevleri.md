# 🚀 EasyStock REST API Tasarımı

# Mehmet Sadık Avcı'nın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Üye Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:**
```json
{
  "email": "kullanici@example.com",
  "password": "Guvenli123!",
  "businessName": "Sadık Usta Butik",
  "fullName": "Sadık Yılmaz"
}
```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu.

## 2. Giriş Yapma
- **Endpoint:** POST /auth/login

- **Request Body:**

```json
{
  "email": "kullanici@example.com",
  "password": "Guvenli123!"
}
```
- **Response:** `200 OK` - `{ "token": "eyJhbG..." } (JWT Token döner).`

## 3. Profil ve İşletme Güncelleme
- **Endpoint:** PUT /auth/profile

- **Request Body:**

```json
{
  "businessName": "Sadık Usta Yeni İşletme Adı",
  "phone": "0555..."
}
```
- **Response:** `200 OK` - Profil başarıyla güncellendi.

## 4. Yeni Ürün Ekleme
- **Endpoint:** POST /products

- **Request Body:**
```json
{
  "name": "Siyah Tişört L Beden",
  "barcode": "8691234567",
  "categoryId": "101",
  "stockQuantity": 50,
  "buyPrice": 120.00,
  "sellPrice": 250.00,
  "minStockLevel": 10
}
```
- **Response:** `201 Created` - Ürün başarıyla eklendi.

## 5. Stok Listeleme
- **Endpoint:** GET /products

- **Response:** `200 OK `- Ürün listesi (Array) döner.

## 6. Ürün ve Barkod Detayı
- **Endpoint:** GET /products/barcode/{barcode}

- **Response:** `200 OK` - Belirli ürüne ait JSON verisi döner.

## 7. Stok Miktarı Güncelleme (Manuel)
- **Endpoint:** PATCH /products/{id}/stock

- **Request Body:**

```json
{ 
  "adjustment": 15 
}
```
- **Response:** `200 OK` - Güncel stok miktarı döner.

## 8. Ürün Silme
- **Endpoint:** DELETE /products/{id}

- **Response:** `204 No Content `- Ürün başarıyla silindi.

## 9. Kategori Yönetimi
- **Endpoint:** POST /categories

- **Request Body:**

```json
{ 
  "name": "Giyim" 
}
```
- **Response:** `201 Created `- Kategori oluşturuldu.

## 10. Akıllı Kritik Stok Listesi (Madde 1)
- **Endpoint:** GET /analytics/low-stock

- **Response:** `200 OK` - Bitmeye yaklaşan ve kritik seviye altındaki ürünler döner.

## 11. Stok Ömrü Tahminleme (Madde 1)
- **Endpoint:** GET /analytics/predict/{id}

- **Response:** `200 OK` - { "estimatedDays": 12, "predictionDate": "2026-03-20" }

## 12. Ölü Stok Analizi (Madde 1)
- **Endpoint:** GET /analytics/dead-stock

- **Response:** `200 OK` - Son 30 gündür satılmayan ürünlerin listesi.

## 13. Satış Kaydı Oluşturma
- **Endpoint:** POST /sales

- **Request Body:**

```json
{
  "productId": "505",
  "quantity": 2,
  "totalPrice": 500.00,
  "paymentMethod": "Credit Card"
}
```
- **Response:** `201 Created` - Satış kaydedildi, stok otomatik düştü.

## 14. Bildirim Yönetimi
- **Endpoint:** GET /notifications

- **Response:** `200 OK` - Okunmamış stok uyarıları listesi.
