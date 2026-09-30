# DESIGN.md — System & UI/UX Design Specification

Dokumen ini berisi spesifikasi sistem desain visual, arsitektur komponen, antarmuka pengguna (UI/UX), serta hierarki struktur proyek untuk **ova.iandev** (Period & Mood Journal PWA).

---

## 1. Filosofi & Konsep Desain

**ova.iandev** mengusung filosofi _offline-first_, _privacy-focused_, dan _minimalist wellness_. Antarmuka dirancang lembut dengan warna-warna pastel untuk memberikan kenyamanan emosional bagi pengguna saat mencatat siklus harian.

### Prinsip Utama

- **Privasi Sepenuhnya:** Seluruh data tersimpan secara lokal di peramban (IndexedDB/LocalStorage) tanpa ketergantungan API pihak ketiga[cite: 4].
- **Visual Bebas Kebisingan:** Tampilan kalender memanfaatkan indikator ikonik (_dot badge_ & _emoji icon_) tanpa teks berjejal untuk menjaga kebersihan tata letak[cite: 4].
- **Responsif & Kompak:** Didesain terpusat dengan pendekatan _mobile-first_ yang teradaptasi dengan rapi pada layar _desktop_[cite: 4].

---

## 2. Tipografi & Ikonografi

### A. Tipografi

- **Font Family:** `Plus Jakarta Sans` (Google Fonts)[cite: 4].
- **Skala Bobot (Font Weights):**
  - `Light (300)` / `Regular (400)`: Teks paragraf, deskripsi fase, dan catatan harian[cite: 4].
  - `Medium (500)` / `SemiBold (600)`: Label tombol, status indikator, dan navigasi[cite: 4].
  - `Bold (700)` / `ExtraBold (800)`: Judul halaman, angka tanggal kalender, dan nilai statistik[cite: 4].

### B. Ikonografi

- **Font Awesome 6.4.0 (Free/Solid/Regular):** Digunakan untuk seluruh navigasi tab, aksi modal, dan status indikator[cite: 4].
- **Logo Bunga Lily (SVG Custom):** Digunakan sebagai identitas utama pada _Header App Bar_ dengan latar _gradient_ `from-rose-400 to-pink-500`[cite: 4].

---

## 3. Sistem Warna (Color System)

### A. Warna Utama Aplikasi (Theme Palette)

- **Background Utama:** `bg-pink-50/50` (Merah muda pastel sangat lembut)[cite: 4].
- **Aksen Utama (Brand):** `rose-500` (`#F43F5E`) & `pink-500` (`#EC4899`)[cite: 4].
- **Highlight Teks Selection:** `selection:bg-rose-200 selection:text-rose-900`[cite: 4].
- **Theme Color Manifest:** `#8FA344`[cite: 4].

### B. Palet Fase Hormonal

| Fase           | Warna Latar / Badge                     | Marker Dot       | Warna Teks         | Makna Visual               |
| :------------- | :-------------------------------------- | :--------------- | :----------------- | :------------------------- |
| **Menstruasi** | `bg-rose-100` / `border-rose-200`       | `bg-rose-500`    | `text-rose-700`    | Rest & Self Care[cite: 4]  |
| **Folikuler**  | `bg-emerald-100` / `border-emerald-200` | `bg-emerald-500` | `text-emerald-700` | Energi Meningkat[cite: 4]  |
| **Ovulasi**    | `bg-amber-100` / `border-amber-200`     | `bg-amber-500`   | `text-amber-700`   | Puncak Masa Subur[cite: 4] |
| **Luteal**     | `bg-purple-100` / `border-purple-200`   | `bg-purple-500`  | `text-purple-700`  | Fase Pra-PMS[cite: 4]      |

### C. Pemetaan Suasana Hati (Mood System)

| Keys (`data-mood`)       | Label  | Class Ikon FontAwesome                          | Warna UI                                       |
| :----------------------- | :----- | :---------------------------------------------- | :--------------------------------------------- |
| `lazy`, `lelah`, `tired` | Malas  | `fa-regular fa-face-tired`                      | `text-purple-500`[cite: 4]                     |
| `angry`, `marah`         | Marah  | `fa-regular fa-face-angry`                      | `text-rose-500`[cite: 4]                       |
| `sad`, `sedih`           | Sedih  | `fa-regular fa-face-frown` / `fa-face-sad-tear` | `text-sky-500` / `text-indigo-600`[cite: 4]    |
| `happy`, `senang`        | Senang | `fa-regular fa-face-smile`                      | `text-amber-500` / `text-emerald-600`[cite: 4] |
| `neutral`, `biasa`       | Biasa  | `fa-regular fa-face-meh`                        | `text-slate-500` / `text-amber-600`[cite: 4]   |

---

## 4. Tata Letak & Komponen Utama

### A. Header App Bar

- **Posisi:** `sticky top-0 z-30` dengan efek _Glassmorphism_ (`bg-white/80 backdrop-blur-md border-b border-rose-100`)[cite: 4].
- **Elemen:**
  - Logo SVG Bunga Lily[cite: 4].
  - Judul `ova.iandev` dengan gradien warna[cite: 4].
  - _Badge_ "Offline & Privat"[cite: 4].
  - Tombol Aksi Cepat: `Catat Haid` (`#btn-open-period-modal`) dan `Pengaturan` (`#btn-open-settings-modal`)[cite: 4].

### B. Sistem Navigasi Tab

1. **Beranda (`#tab-dashboard`):**
   - **Hero Banner Fase Aktif:** Menampilkan nama fase saat ini, deskripsi, hari keberapa dalam siklus, dan perkiraan panjang siklus[cite: 4].
   - **Widget Refleksi Cepat:** 5 pilihan tombol mood dan input catatan harian instan[cite: 4].
   - **Kartu Proyeksi 4 Fase:** Tautan langsung menuju panduan fase (`menstrual.html`, `follicular.html`, `ovulation.html`, `luteal.html`)[cite: 4].
   - **Banner Peringatan Pola Siklus / PCOS:** Peringatan kontekstual untuk siklus panjang[cite: 4].
2. **Kalender (`#tab-calendar`):**
   - Grid 7 hari per minggu (`MIN` s/d `SAB`)[cite: 4].
   - Kontrol navigasi bulan (`Sebelumnya`, `Bulan Ini`, `Berikutnya`)[cite: 4].
   - Sel tanggal interaktif yang menampilkan _dot_ fase hormonal dan ikon mood[cite: 4].
3. **Riwayat (`#tab-history`):**
   - Kartu Ringkasan Statistik: _Rata-rata Siklus_, _Rata-rata Durasi Haid_, dan _Total Siklus_[cite: 4].
   - Daftar linier riwayat catatan menstruasi[cite: 4].
4. **Fitur Ekspor PDF:**
   - Tombol `Laporan Dokter (PDF)` pada header navigasi menggunakan pustaka `html2pdf.js`[cite: 4].

### C. Komponen Overlay & Modal

- **Toast Notification (`#toast`):** Peringatan melayang top-right dengan animasi transisi[cite: 4].
- **Modal Catatan Haid (`#modal-period`):** Form input tanggal mulai, tanggal selesai, dan opsi _checkbox_ "Haid masih berlangsung"[cite: 4].
- **Modal Detail Hari (`#modal-day-detail`):** Modal interaktif saat sel tanggal kalender diklik untuk mencatat mood dan catatan detail[cite: 4].
- **Modal Pengaturan (`#modal-settings`):** Panel untuk konfigurasi notifikasi lokal browser[cite: 4].

---

## 5. Arsitektur File & Pembungkusan Container

## Struktur Direktori Proyek

```text
.
├── index.html                  # Entry point aplikasi (UI Skeleton)
├── public/
│   └── manifest.json           # Konfigurasi PWA Manifest
├── src/
│   ├── app.js                  # Main Application Orchestrator
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css        # Stylesheet utama & reset
│   │       └── components.css  # Utility styling khusus komponen
│   ├── components/
│   │   └── Calendar.js         # Renderer Komponen Kalender
│   └── core/
│       └── algorithms/
│           └── phaseEngine.js  # Kalkulator Fase & Estimasi Siklus
├── pages/                      # Halaman Edukasi Detail 4 Fase
│   ├── menstrual.html
│   ├── follicular.html
│   ├── ovulation.html
│   └── luteal.html
├── Dockerfile                  # Container build config (Nginx Alpine)
└── docker-compose.yml          # Local/Production deployment setup (Port 8081)
```

### Konfigurasi Container Docker

- **Base Image:** `nginx:alpine`
- **Port Mapping:** `8081:80` (Host:Container)[cite: 3]
- **Resource Constraint:** CPU Max `0.5`, RAM Max `128M`

```

```
