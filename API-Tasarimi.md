# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [openapi.yaml](openapi.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification
##Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.



```yaml
openapi: 3.0.3
info:
  title: EasyStock Akıllı Envanter Yönetim API'si
  version: 1.1.0
  description: >
    Küçük işletmeler için geliştirilmiş, akıllı tahminleme yeteneklerine sahip
    RESTful envanter yönetim servisi. Bu API, JWT tabanlı güvenlik katmanı ile
    korunmakta olup, ürünlerin stok ömrünü geçmiş satış verilerine dayanarak
    tahmin edebilen bir analitik motoruna sahiptir. 
    
    Özellikler:
    - JWT Tabanlı Kimlik Doğrulama
    - Barkod Destekli Ürün Yönetimi
    - Madde 1: Dinamik Satış Tahminleme Algoritması
    - Kritik Stok ve Bildirim Yönetimi
  contact:
    name: Sadık Avcı - EasyStock Geliştirme Ekibi
    email: sadikk.avciii@gmail.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/v1
    description: Yerel Geliştirme Sunucusu (Development)
  - url: https://api.easystock.com/v1
    description: Üretim Sunucusu (Production)

tags:
  - name: Auth
    description: Kullanıcı kayıt, giriş ve yetkilendirme işlemleri.
  - name: Products
    description: Ürünlerin tanımlanması, listelenmesi ve yönetilmesi.
  - name: Categories
    description: Ürün gruplandırma ve kategori yönetimi.
  - name: Analytics
    description: Satış hızı analizi ve stok tahminleme (Madde 1).
  - name: Sales
    description: Satış kayıtları ve stok hareketleri.
  - name: System
    description: Bildirimler, raporlar ve veri aktarımı.

security:
  - BearerAuth: []

paths:
  # --- 1. ÜYE OLMA ---
  /auth/register:
    post:
      tags: [Auth]
      summary: Yeni Kullanıcı Kaydı
      operationId: registerUser
      description: İşletme sahibi için yeni bir hesap oluşturur.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegisterInput'
      responses:
        "201":
          description: Kullanıcı başarıyla oluşturuldu.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        "400":
          $ref: '#/components/responses/BadRequest'

  # --- 2. GİRİŞ YAPMA ---
  /auth/login:
    post:
      tags: [Auth]
      summary: Kullanıcı Girişi
      operationId: loginUser
      description: Email ve şifre ile JWT token alır.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserLoginInput'
      responses:
        "200":
          description: Giriş başarılı.
          content:
            application/json:
              schema:
                type: object
                properties:
                  token: { type: string, example: "eyJhbGciOiJIUzI1Ni..." }
                  expiresIn: { type: integer, example: 3600 }
        "401":
          $ref: '#/components/responses/Unauthorized'

  # --- 3. PROFİL GÜNCELLEME ---
  /auth/profile:
    put:
      tags: [Auth]
      summary: Profil ve İşletme Bilgilerini Güncelle
      operationId: updateProfile
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserProfileUpdate'
      responses:
        "200":
          description: Güncelleme başarılı.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

  # --- 4 & 5. ÜRÜN YÖNETİMİ ---
  /products:
    get:
      tags: [Products]
      summary: Tüm Stokları Listeleme
      operationId: listProducts
      parameters:
        - name: categoryId
          in: query
          schema: { type: string }
        - name: search
          in: query
          description: İsim veya barkod ile ara
          schema: { type: string }
      responses:
        "200":
          description: Başarılı ürün listesi.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
    post:
      tags: [Products]
      summary: Yeni Ürün Ekleme
      operationId: createProduct
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductInput'
      responses:
        "201":
          description: Ürün başarıyla eklendi.

  # --- 6. BARKOD SORGULAMA ---
  /products/barcode/{barcode}:
    get:
      tags: [Products]
      summary: Barkod ile Ürün Sorgulama
      operationId: getProductByBarcode
      parameters:
        - name: barcode
          in: path
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Ürün bulundu.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        "404":
          $ref: '#/components/responses/NotFound'

  # --- 7. STOK GÜNCELLEME ---
  /products/{productId}/stock:
    patch:
      tags: [Products]
      summary: Manuel Stok Miktarı Güncelleme
      description: Sayım farkları veya mal kabulleri için kullanılır.
      parameters:
        - name: productId
          in: path
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                adjustment: { type: integer, example: 10, description: "Eklenecek (+) veya çıkarılacak (-) miktar." }
      responses:
        "200":
          description: Stok güncellendi.

  # --- 8. ÜRÜN SİLME ---
  /products/{productId}:
    delete:
      tags: [Products]
      summary: Ürün Silme
      parameters:
        - name: productId
          in: path
          required: true
          schema: { type: string }
      responses:
        "204":
          description: Silindi.

  # --- 9. KATEGORİ YÖNETİMİ ---
  /categories:
    get:
      tags: [Categories]
      summary: Kategorileri Listele
    post:
      tags: [Categories]
      summary: Kategori Oluşturma
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string, example: "Gıda" }

  # --- 10. AKILLI KRİTİK STOK LİSTESİ ---
  /analytics/low-stock:
    get:
      tags: [Analytics]
      summary: Akıllı Kritik Stok Listesi
      description: Hem manuel sınırı geçen hem de sistemin biteceğini tahmin ettiği ürünler.
      responses:
        "200":
          description: Başarılı liste.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'

  # --- 11. STOK ÖMRÜ TAHMİNLEME (MADDE 1) ---
  /analytics/predict/{productId}:
    get:
      tags: [Analytics]
      summary: Stok Ömrü Tahminleme
      operationId: getPrediction
      description: Geçmiş satış hızını analiz ederek kalan süreyi hesaplar.
      parameters:
        - name: productId
          in: path
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Tahmin sonucu.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PredictionResponse'

  # --- 12. ÖLÜ STOK ANALİZİ ---
  /analytics/dead-stock:
    get:
      tags: [Analytics]
      summary: Ölü Stok Analizi
      description: Son 30 gündür satışı olmayan ürünleri listeler.

  # --- 13. SATIŞ KAYDI ---
  /sales:
    post:
      tags: [Sales]
      summary: Satış Kaydı Oluşturma
      operationId: recordSale
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SaleInput'
      responses:
        "201":
          description: Satış kaydedildi.

  # --- 14. BİLDİRİMLER ---
  /notifications:
    get:
      tags: [System]
      summary: Bildirim Yönetimi
      description: Okunmamış stok uyarılarını getirir.

  # --- 15. EXPORT ---
  /reports/export:
    get:
      tags: [System]
      summary: Veri Dışa Aktarma (Export)
      parameters:
        - name: format
          in: query
          required: true
          schema: { type: string, enum: [pdf, excel] }
      responses:
        "200":
          description: Dosya stream veya URL döner.

# -------------------------------------------------------------------
# COMPONENTS: MODELS, RESPONSES, SECURITY
# -------------------------------------------------------------------
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  responses:
    BadRequest:
      description: Geçersiz veri girişi.
      content:
        application/json:
          schema: { $ref: '#/components/schemas/Error' }
    Unauthorized:
      description: Kimlik doğrulama hatası.
    NotFound:
      description: Kaynak bulunamadı.

  schemas:
    # Kullanıcı Modelleri
    UserRegisterInput:
      type: object
      required: [email, password, firstName, lastName]
      properties:
        email: { type: string, format: email, example: "kullanici@example.com" }
        password: { type: string, minLength: 8, example: "Guvenli123!" }
        firstName: { type: string, example: "Ahmet" }
        lastName: { type: string, example: "Yılmaz" }
        businessName: { type: string, example: "Ahmet Ticaret" }

    UserLoginInput:
      type: object
      required: [email, password]
      properties:
        email: { type: string, format: email }
        password: { type: string }

    UserResponse:
      type: object
      properties:
        id: { type: string }
        email: { type: string }
        businessName: { type: string }

    UserProfileUpdate:
      type: object
      properties:
        businessName: { type: string }
        phone: { type: string }

    # Ürün Modelleri
    Product:
      type: object
      properties:
        id: { type: string, example: "64a..." }
        name: { type: string, example: "Siyah Tişört L" }
        barcode: { type: string, example: "869123456" }
        stockQuantity: { type: integer, example: 45 }
        sellPrice: { type: number, format: float, example: 250.00 }
        minStockLevel: { type: integer, example: 10 }
        category: { type: string, example: "Giyim" }

    ProductInput:
      type: object
      required: [name, barcode, stockQuantity, buyPrice, sellPrice]
      properties:
        name: { type: string, minLength: 2, maxLength: 100 }
        barcode: { type: string }
        stockQuantity: { type: integer, minimum: 0 }
        buyPrice: { type: number, format: float }
        sellPrice: { type: number, format: float }
        categoryId: { type: string }
        minStockLevel: { type: integer, default: 5 }

    # Analitik ve Satış Modelleri
    PredictionResponse:
      type: object
      properties:
        productId: { type: string }
        averageDailySales: { type: number, example: 2.3 }
        estimatedDaysRemaining: { type: integer, example: 12 }
        expectedDepletionDate: { type: string, format: date, example: "2026-03-21" }

    SaleInput:
      type: object
      required: [productId, quantity, totalPrice]
      properties:
        productId: { type: string }
        quantity: { type: integer, minimum: 1 }
        totalPrice: { type: number, format: float }
        paymentMethod: { type: string, enum: [Cash, CreditCard] }

    Error:
      type: object
      properties:
        code: { type: integer }
        message: { type: string, example: "Hatalı istek" }
      type: object
      required: [message]
      properties:
        message: { type: string, example: "Ürün bulunamadı" }

