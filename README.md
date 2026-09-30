# 🌸 ova.iandev - Period & Mood Journal

**Offline-First PWA untuk tracking menstruasi dan mood journal**

![Version](https://img.shields.io/badge/version-1.2.1-blue)
![Docker](https://img.shields.io/badge/docker-nginx--alpine-blue)
![PWA](https://img.shields.io/badge/PWA-enabled-green)

## 🆕 Terbaru di v1.2.1 (Pembaruan & Bug Fixes)

- 🐛 **Fix Bug 1970 & 20.000 Hari:** Sistem kini menangani status haid "Masih Berlangsung" dengan akurat. Durasi rata-rata hanya dihitung dari siklus yang sudah selesai.
- 🎯 **Akurasi Zona Waktu Lokal:** Kalender kini menggunakan zona waktu lokal perangkat pengguna, bukan UTC, sehingga penandaan "Hari Ini" tidak pernah meleset.
- 🔮 **Pembatasan Prediksi Cerdas:** Prediksi fase Folikuler, Ovulasi, dan Luteal dibatasi maksimal 1 siklus ke depan agar kalender tetap rapi, dan prediksi ditahan hingga masa haid saat ini dinyatakan selesai.

## ✨ Fitur

- 📅 **Tracking Menstruasi** - Catat dan monitor siklus haid
- 🌙 **4 Fase Hormonal** - Menstruasi, Folikuler, Ovulasi, Luteal
- 😊 **Mood Journal** - Catat mood harian dengan emoji
- 📊 **Statistik Siklus** - Analisis rata-rata siklus & durasi haid yang akurat
- 📴 **Offline-First PWA** - Jalan tanpa internet, data tersimpan di browser
- 📄 **Export PDF** - Buat laporan untuk dokter
- 🔔 **Notifikasi Lokal** - Pengingat siklus (optional)

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 16+ (untuk development)
- Docker & Docker Compose (untuk production)

### Cara Run Local

```bash
# Install serve (static file server)
npm install -g serve

# Run aplikasi
npx serve .
```
