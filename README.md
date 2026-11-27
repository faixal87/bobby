# 🛡️ POLYCC DASHBOARD — Latihan Keselamatan Siber

Dashboard **Security Operations Centre (SOC)** statik untuk tujuan latihan. Ia dibina dengan HTML, CSS, JavaScript biasa dan [Chart.js](https://www.chartjs.org/), tanpa framework, server atau database.

**Demo:** https://faixal87.github.io/bobby/

> Semua data adalah **dummy**. Alamat IP diambil daripada julat dokumentasi RFC 5737 (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`), jadi tiada IP sebenar terlibat.

## Ciri-ciri

| Komponen | Apa yang dipaparkan |
|---|---|
| KPI cards | Jumlah event, login gagal, IP unik, kadar disekat, alert kritikal |
| Timeline | Event ikut masa, bertindan ikut severity |
| Doughnut | Taburan jenis serangan (klik untuk tapis) |
| Top 10 IP | Penyerang paling aktif (klik untuk cari) |
| Negara / Server | Asal serangan dan server yang paling disasar |
| Jadual alert | 100 event terkini dengan badge severity |
| Penapis | Julat masa, severity, jenis serangan dan carian teks |
| Mod LIVE | Simulasi event baru masuk setiap 2.5 saat |
| Export CSV | Muat turun data yang sedang ditapis |

## Struktur fail

```
bobby/
├── index.html              ← struktur halaman
├── assets/polycc-logo.png  ← logo POLYCC (header)
├── css/style.css           ← tema gelap & layout
├── js/app.js               ← logik (muat → tapis → KPI → carta → jadual)
├── js/vendor/chart.umd.min.js  ← Chart.js (offline, tak perlu internet)
├── data/events.json        ← 600 event dummy
└── tools/generate_data.py  ← skrip jana semula data
```

## Cara jalankan

Dashboard ini guna `fetch()` untuk baca fail JSON, jadi **ia tak boleh dibuka dengan double-click** (`file://`). Pilih salah satu cara ini:

- **VS Code:** pasang extension *Live Server*, klik kanan `index.html` dan pilih **Open with Live Server**
- **Python:** jalankan `python -m http.server 8000`, kemudian buka `http://localhost:8000`
- **GitHub Pages:** push ke repo, kemudian pergi **Settings → Pages → Deploy from a branch → `main` / root**

Untuk jana semula data dummy:

```bash
python3 tools/generate_data.py
```

---

## 📚 Modul Latihan (cadangan susunan)

Setiap modul membina atas modul sebelumnya. Peserta boleh mula dengan `index.html` kosong dan rujuk kod ini sebagai jawapan.

### Modul 1 — Kenali data (30 minit)
- Buka `data/events.json`. Kenal pasti medan: `type`, `severity`, `source_ip`, `action`.
- Bincang: apa beza *Blocked*, *Quarantined*, *Investigating* dan *Escalated* dalam SOC sebenar?
- **Latihan:** kira secara manual berapa event `Critical` dalam 10 rekod pertama.

### Modul 2 — Layout & KPI cards (45 minit)
- Bina header, bar penapis dan 5 KPI card menggunakan CSS Grid (`auto-fit` + `minmax`).
- Dalam JS, guna `fetch()` dan `Array.filter()` untuk kira nilai KPI.
- **Latihan:** tambah KPI ke-6, iaitu "Serangan DDoS".

### Modul 3 — Carta dengan Chart.js (60 minit)
- Lukis doughnut (jenis serangan) dan bar mendatar (Top 10 IP).
- Fahami fungsi `countBy()`: kumpul → kira → susun → potong 10 teratas.
- Bina timeline bertindan dengan konsep "baldi masa" (`bucketConfig()`).
- **Latihan:** tambah carta "Port paling disasar".

### Modul 4 — Interaktiviti (45 minit)
- Sambungkan penapis kepada `refresh()`.
- Klik pada carta untuk menapis (lihat `onClick` dalam `createCharts()`).
- Debounce pada kotak carian: kenapa kita tunggu 250 ms?
- **Latihan:** tambah penapis "Tindakan" (Blocked/Logged/…).

### Modul 5 — Jadual & keselamatan kod (30 minit)
- Bina jadual alert menggunakan template string.
- **Penting:** kenapa fungsi `escapeHtml()` diperlukan? Uji dengan mengubah satu `country` dalam JSON kepada `<img src=x onerror=alert(1)>` dan lihat apa yang berlaku jika `escapeHtml` dibuang. Ini contoh **XSS** dalam dashboard keselamatan sendiri!

### Modul 6 — Mod LIVE & deploy (30 minit)
- `setInterval()` untuk simulasi event masuk masa nyata.
- Push ke GitHub dan aktifkan GitHub Pages.
- **Cabaran:** bunyikan amaran (atau tukar tajuk tab) apabila event `Critical` baru masuk.

---

## Idea lanjutan
- Peta dunia asal serangan (Leaflet.js)
- Sambung ke log sebenar: parse `/var/log/auth.log` (SSH brute force) dengan Python dan tukar kepada format JSON yang sama
- Simpan tetapan penapis dalam `localStorage`
- Mod terang / gelap
