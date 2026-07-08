# ASGARD INTELLIGENCE (GNN-AIOps)
## GRUP ÜYELERİ, GENEL ROLLER VE DETAYLI GÖREV DAĞILIMI

Bu belge, **ASGARD INTELLIGENCE / GNN-AIOps (Gigafactory Real-Time Anomaly Prediction & Digital Twin)** projesinde görev alan ekip üyelerinin üstlendikleri genel rolleri ve kod tabanındaki somut bileşenler üzerinden detaylı görev dağılımlarını tanımlamaktadır.

---

## 👥 Ekip ve Genel Roller

| Grup Üyesi | Genel Rolü | Odak Alanı |
| :--- | :--- | :--- |
| **Ahmet İşleyen** | **AI & API Mimarı** | Graph ML (GAT) Model Geliştirimi, Tahmin Motoru ve API Entegrasyonu (Sistemin Zekası) |
| **Mehmet Ersolak** | **Backend & Veri Mühendisi** | Veri Tabanı Tasarımı, Data Ingestion Pipeline ve Güvenlik Altyapısı (Sistemin Temeli) |
| **Elif Karaşahin** | **Frontend & UX Mimarı** | 3D Dijital İkiz (Digital Twin), SPA Yönetimi ve Kullanıcı Deneyimi Tasarımı (Sistemin Yüzü) |

---

## 🛠️ Detaylı Görev Dağılımı ve Sorumluluklar

### 🧠 1. Ahmet İşleyen — AI & API Mimarı (Sistemin Zekâsı)
Ahmet İşleyen, projenin tahminleme gücünü oluşturan Graph Machine Learning modellerinin mimarisinden, bu modellerin API katmanı üzerinden dış dünyaya sunulmasından ve açıklanabilir yapay zeka (XAI) süreçlerinden sorumludur.

#### **Somut Katkılar ve Kod Tabanındaki Sorumluluk Alanları:**
*   **Graph Attention Network (GAT) Model Geliştirimi (`main.py`):**
    *   2 katmanlı ve 4 dikkat kafasına (attention head) sahip **GATAnomalyModel** (`torch.nn` ve `torch_geometric.nn.GATConv` tabanlı) yapısını tasarlamış ve eğitmiştir.
    *   Fabrikadaki dört ana departmanın (IT, IoT, Finans, Lojistik) birbirleriyle ilişkilerini ve uzamsal etkilerini Graph ML yapısıyla modellemiştir.
    *   `gigafactory_gat_model.pth` ağırlık dosyasının backend entegrasyonunu sağlamış, modelin bellek verimliliği için `eval()` modunda çalıştırılmasını yönetmiştir.
*   **API Tahmin & Stream Entegrasyonu (`main.py` -> `/api/stream`):**
    *   SQLite'dan akan 16 boyutlu canlı telemetri verisini alıp 4 düğümlü (4 node x 4 feature) PyTorch tensörlerine dönüştüren ve GAT modeline besleyen boru hattını kodlamıştır.
    *   Modelin ürettiği logit'leri `F.softmax` ile olasılık puanına (`anomaly_score`) dönüştüren ve eşik değeri (`> 0.5`) ile anomali etiketini belirleyen mekanizmayı kurmuştur.
    *   Düğümler arasındaki etkileşimi analiz etmek için dikkat ağırlıklarını (`attention_weights`) çıkarıp frontend'in görselleştirebileceği formata (`node_attn`) indirgemiştir.
*   **Açıklanabilir Yapay Zeka (XAI) Modülleri:**
    *   Anomali tespitlerinde karar mekanizmasının şeffaflığı için **SHAP** ve **LIME** öznitelik katkı mimarilerini tasarlamış, karar metriklerini API üzerinden aktarmıştır.
*   **Sunum ve Simülasyon Senaryoları (Demo Modu):**
    *   Yapay anomali enjeksiyonu (`/api/demo/presentation-start`) için IT (yüksek gecikme ve paket kaybı) ve IoT (yüksek titreşim ve sıcaklık) arıza senaryolarını yazmıştır.

---

### 🗄️ 2. Mehmet Ersolak — Backend & Veri Mühendisi (Veri Altyapısı)
Mehmet Ersolak, sistemin üzerinde çalıştığı veritabanı altyapısının kurulmasından, saniyede binlerce verinin işlendiği veri akış hatlarının (ingestion pipeline) yönetiminden, kullanıcı yönetiminden ve sistem güvenliğinden sorumludur.

#### **Somut Katkılar ve Kod Tabanındaki Sorumluluk Alanları:**
*   **Büyük Ölçekli Veri Tabanı Mimarisi (`gigafactory_live.db`):**
    *   500.000'den fazla satır içeren yüksek performanslı SQLite veritabanı şemasını kurgulamıştır.
    *   Zaman serisi telemetri verilerinin (`live_telemetry` tablosu) hızlı sorgulanması için ROWID tabanlı indeksleme mekanizmasını optimize etmiştir.
*   **Veri Analizi ve Boru Hattı Doğrulama (`analyze_db.py`):**
    *   Pandas kütüphanesini kullanarak veri tutarlılığını, eksik değer analizini ve veritabanı şema doğrulamasını yapan analiz script'lerini yazmıştır.
*   **Güvenlik ve Yetkilendirme (RBAC) Altyapısı (`main.py`, `users.json`, `auth.js`):**
    *   **JWT (JSON Web Token)** tabanlı kimlik doğrulama sistemini (`PyJWT` kütüphanesi kullanarak) entegre etmiştir.
    *   Rol Bazlı Erişim Kontrolü (RBAC) için `users`, `user_settings` ve `access_requests` tablolarını kurmuştur.
    *   Kullanıcı departman yetkilerini kontrol eden `get_current_user` ve `admin_required` FastAPI dependency (bağımlılık) fonksiyonlarını yazmıştır.
*   **Acil Erişim Yetkilendirme Yönetimi:**
    *   Erişimi olmayan sayfalar için kullanıcıların acil yetki talep edebildiği ve yöneticilerin bu talepleri onaylayıp iptal edebildiği `/api/emergency/request` ve `/api/admin/requests/resolve` API uç noktalarını (endpoints) tasarlamıştır.
    *   Güvenlik denetimleri için `access_requests.log` dosyasına yazma yapan denetim (audit) loglama sistemini kurmuştur.

---

### 🎨 3. Elif Karaşahin — Frontend & UX Mimarı (Kullanıcı Deneyiminin Mimarı)
Elif Karaşahin, fabrikadaki 3D fiziksel varlıkların ve ağ ilişkilerinin web tarayıcısında gerçek zamanlı izlenebilmesini sağlayan 3D Dijital İkiz (Digital Twin) arayüzünü, yüksek performanslı SPA (Tek Sayfa Uygulaması) mimarisini ve kullanıcı odaklı ekranları geliştirmiştir.

#### **Somut Katkılar ve Kod Tabanındaki Sorumluluk Alanları:**
*   **3D Digital Twin & Parçacık Simülasyonu (`dashboard.html`):**
    *   WebGL tabanlı **Three.js** kütüphanesini kullanarak fabrikadaki veri akışını gösteren 3D parçacık sistemini (`particle-canvas`) ve 3D arka planı kodlamıştır.
    *   Merkezi düğümün durumunu (Kararlı -> Yeşil, Uyarı -> Sarı, Kritik -> Kırmızı) ve anomali yayılımını gösteren animasyonlu halka sistemlerini (`pulse-ring`, `orbital-ring`) CSS ve JS ile hayata geçirmiştir.
*   **Yüksek Performanslı SPA Yönetimi & State Management:**
    *   Vanilla JS ve optimize edilmiş DOM manipülasyonları kullanarak gecikmesiz çalışan SPA sayfa yönetim altyapısını kurmuştur.
    *   Departmanlar arası geçişleri (`it.html`, `ıot.html`, `otonomLojistik.html`, `finans.html`, `yapayZekaV2.html`, `profil.html`, `ayarlar.html`) dinamik olarak yöneten menü ve yetki kontrollerini sağlamıştır.
*   **Gelişmiş Veri Görselleştirme:**
    *   Yapay zeka tahmin sonuçlarını ve risk skorlarını görselleştirmek için **Chart.js** entegrasyonunu yapmış, dinamik grafik güncellemelerini optimize etmiştir.
    *   Ahmet İşleyen'in sağladığı XAI (SHAP & LIME) öznitelik katkı verilerini renkli etki barlarıyla dinamik olarak ekrana basan etkileşimli paneller tasarlamıştır.
*   **Kullanıcı Arayüzü & Raporlama Araçları:**
    *   **html2canvas** ve **jspdf** kütüphanelerini entegre ederek kullanıcıların anomali analiz raporlarını anlık olarak PDF dosyasına dönüştürüp indirmesini sağlayan dışa aktarma modülünü kodlamıştır.
    *   Hassas yetki yönetimi ekranları ve acil yetki talep modal formlarının şık ve duyarlı (responsive) tasarımlarını **Tailwind CSS** kullanarak hazırlamıştır.

---

## 💻 Teknoloji Yığını ve Ekip Sinerjisi

```mermaid
graph TD
    subgraph Veri & Altyapısı (Mehmet)
        DB[(SQLite: gigafactory_live.db)] -->|Telemetri Verisi| Stream[FastAPI Stream Pipeline]
        DB -->|Kullanıcı Yetkileri| Auth[JWT & RBAC Güvenlik]
    end

    subgraph Yapay Zeka Katmanı (Ahmet)
        Stream -->|Girdi Tensörleri| GAT[GAT PyTorch Model]
        GAT -->|Anomali Skoru & Dikkat Ağırlıkları| Explain[SHAP & LIME XAI]
    end

    subgraph Arayüz & Görselleştirme (Elif)
        Explain -->|Tahmin & XAI Ayrıntıları| UI[SPA Dashboard - Tailwind]
        Auth -->|Yetki Bilgisi| UI
        UI -->|Three.js Canvas| Twin[3D Digital Twin Visualizer]
        UI -->|html2canvas / jsPDF| PDF[PDF Rapor Çıktısı]
    end
```

---

## 📈 Sonuç ve Proje Değeri
*   **Ahmet'in** geliştirdiği GAT modeli, anomaliyi sadece tekil verilere bakarak değil, departmanlar arası ağ ilişkilerini inceleyerek yakalar (Yüksek Yapay Zeka Doğruluğu).
*   **Mehmet'in** kurduğu veri altyapısı, 500.000 satırlık veriden milisaniyeler düzeyinde veri okuyup JWT güvenliğiyle doğrular (Yüksek Backend Performansı ve Güvenlik).
*   **Elif'in** kurguladığı 3D Dijital İkiz arayüzü ise bu karmaşık yapay zeka kararlarını fabrika operatörlerinin anında anlayıp aksiyon alabileceği görsel bir şölene dönüştürür (Yüksek UX/Kullanılabilirlik).

Bu üç temel disiplinin bir araya gelmesiyle **ASGARD INTELLIGENCE**, endüstriyel operasyonlarda proaktif hata önleme süreçlerinin en gelişmiş örneklerinden biri haline gelmiştir.
