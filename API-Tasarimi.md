# API Tasarımı - OpenAPI Specification Örneği

**OpenAPI Spesifikasyon Dosyası:** [openapi.yaml](openapi.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.

## OpenAPI Specification
##Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış örnek bir API tasarımını içermektedir.















openapi: 3.0.0
info:
  title: EasyStock API
  description: Küçük İşletmeler İçin Akıllı Stok ve Analitik Takip Sistemi API Dökümantasyonu.
  version: 1.0.0

servers:
  - url: https://api.easystock.com/v1
    description: Üretim Sunucusu

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

paths:
  # --- KULLANICI VE YETKİLENDİRME ---
  /auth/register:
    post:
      summary: Yeni kullanıcı kaydı
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username: {type: string}
                email: {type: string}
                password: {type: string}
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu.

  /auth/login:
    post:
      summary: Kullanıcı girişi
      tags: [Auth]
      responses:
        '200':
          description: Giriş başarılı, JWT token döner.

  /auth/profile:
    put:
      summary: Profil ve işletme bilgilerini güncelleme
      tags: [Auth]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Profil güncellendi.

  # --- ÜRÜN VE STOK YÖNETİMİ ---
  /products:
    get:
      summary: Tüm ürünleri listeleme
      tags: [Products]
      responses:
        '200':
          description: Ürün listesi başarıyla getirildi.
    post:
      summary: Yeni ürün ekleme
      tags: [Products]
      security:
        - bearerAuth: []
      responses:
        '201':
          description: Ürün eklendi.

  /products/{id}:
    get:
      summary: Ürün detayını getir
      tags: [Products]
      parameters:
        - name: id
          in: path
          required: true
          schema: {type: string}
    delete:
      summary: Ürünü sil
      tags: [Products]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Ürün silindi.

  /products/barcode/{code}:
    get:
      summary: Barkod ile ürün sorgulama
      tags: [Products]
      parameters:
        - name: code
          in: path
          required: true
          schema: {type: string}

  /products/{id}/stock:
    patch:
      summary: Stok miktarını güncelle (Manuel)
      tags: [Products]
      requestBody:
        content:
          application/json:
            schema:
              properties:
                adjustment: {type: integer, description: "Örn: +10 veya -5"}
      responses:
        '200':
          description: Stok güncellendi.

  /categories:
    get:
      summary: Kategorileri listele
    post:
      summary: Yeni kategori oluştur

  # --- AKILLI ANALİTİK (MADDE 1) ---
  /analytics/low-stock:
    get:
      summary: Kritik seviyedeki ürünleri listele
      tags: [Analytics]

  /analytics/predict/{id}:
    get:
      summary: Stok ömrü tahmini (Kalan gün sayısı)
      tags: [Analytics]

  /analytics/dead-stock:
    get:
      summary: Hareket görmeyen ölü stok analizi
      tags: [Analytics]


