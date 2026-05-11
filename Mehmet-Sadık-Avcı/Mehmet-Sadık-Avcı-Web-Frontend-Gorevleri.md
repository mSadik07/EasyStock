# Mehmet SAdık Avcı'nın Web Frontend Görevleri
- **Web Frontend Adresi:** [frontend.EasyStock.com](https://easy-stock-u7j3.vercel.app/register.html)  **Front-end Test Videosu:** [FRONTEND Tanıtım Videosu](https://youtu.be/wgvCAJsZCSs)

### 1. Üye Olma
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kullanıcı adı, email adresi ve şifre gibi temel bilgileri alarak veritabanına kaydeder.

### 2. Giriş Yapma
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kayıtlı kullanıcıların email ve şifre ile sisteme erişmesini sağlar. Başarılı girişte, diğer isteklere yetki verecek bir **JWT (Token)** döndürür.

### 3. Profil ve İşletme Güncelleme
* **API Metodu:** `PUT /auth/profile`
* **Açıklama:** Kullanıcının işletme adını, şifresini veya iletişim bilgilerini güncellemesine olanak tanır.

### 4. Yeni Ürün Ekleme
* **API Metodu:** `POST /products`
* **Açıklama:** Envantere yeni bir ürün tanımlar. Ürün adı, barkod, birim fiyat, kategori ve başlangıç stok miktarı gibi verileri sisteme işler.

### 5. Stok Listeleme
* **API Metodu:** `GET /products`
* **Açıklama:** Kayıtlı tüm ürünlerin listesini, güncel stok miktarlarını ve fiyatlarını döndürür. Arama ve filtreleme (kategoriye göre vb.) özelliklerini içerir.

### 6. Ürün ve Barkod Detayı
* **API Metodu:** `GET /products/:id` veya `/products/barcode/:code`
* **Açıklama:** Belirli bir ürünün tüm detaylarını getirir. Mobil cihazdan barkod taratıldığında ilgili ürünün bilgilerine ulaşmak için kullanılır.

### 7. Stok Miktarı Güncelleme
* **API Metodu:** `PUT /products/:id/stock`
* **Açıklama:** Mevcut bir ürünün stok adedini manuel olarak artırır (mal kabul) veya azaltır (fire/düzeltme). Sadece miktar alanını güncellediği için `PATCH` kullanılır.

### 8. Ürün Silme
* **API Metodu:** `DELETE /products/:id`
* **Açıklama:** Artık satılmayan veya yanlış eklenen bir ürünü sistemden tamamen kaldırır.

### 9. Kategori Listeleme
* **API Metodu:** `POST /categories` & `GET /categories`
* **Açıklama:** Ürünleri gruplandırmak için (Örn: Gıda, Kozmetik) yeni kategoriler oluşturur ve mevcut kategorileri listeler.

### 10. Akıllı Kritik Stok Listesi
* **API Metodu:** `GET /analytics/low-stock`
* **Açıklama:** Belirlenen kritik sınırın altına düşen veya sistemin "bitmek üzere" olarak tahmin ettiği ürünleri öncelikli olarak listeler.

### 11. Stok Ömrü Tahminleme
* **API Metodu:** `GET /analytics/predict/:id`
* **Açıklama:** Geçmiş satış hızına göre bir ürünün mevcut stokla kaç gün daha yeteceğini hesaplayan analiz verisini döndürür.

### 12. Ölü Stok Analizi
* **API Metodu:** `GET /analytics/dead-stock`
* **Açıklama:** Uzun süredir (Örn: 30 gün) hiç hareket görmemiş, satılmayan ürünleri raporlar.

### 13. Satış Kaydı Oluşturma
* **API Metodu:** `POST /sales`
* **Açıklama:** Yapılan her satışı sisteme işler. Bu işlem otomatik olarak stok miktarını düşürür ve analitik modülünün satış hızını hesaplaması için veri sağlar.

### 14. Bildirim Yönetimi
* **API Metodu:** `GET /notifications`
* **Açıklama:** Kritik stok uyarılarını ve sistem mesajlarını kullanıcıya iletir. Mobil cihazlarda push bildirim tetikleyicisi olarak çalışır.
