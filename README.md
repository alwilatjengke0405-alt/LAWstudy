# 🎓 LAW Study — Study Companion & Gamified Productivity

Aplikasi web produktivitas dan pendamping belajar interaktif dengan sistem gamifikasi, timer Pomodoro, to-do list, kalkulator nilai, jadwal, dan countdown ujian. Dilengkapi autentikasi login & registrasi yang terhubung ke database **SQLite serverless (Cloudflare D1)** di **Cloudflare Pages**.

---

## 🚀 Fitur Utama

- 🏠 **Dashboard & Daily Missions:** Maskot interaktif dengan eye-tracking kursor mouse, sapaan dinamis, quotes motivasi, dan pelacak streak harian.
- ⏱️ **Pomodoro Timer:** Mode fokus 25 menit & istirahat 5 menit, Web Audio API synthesizer bawaan (tanpa file audio eksternal), serta notifikasi browser.
- 📝 **Daftar Tugas (To-Do List):** Kategori mata pelajaran, efek coret tugas selesai, poin gamifikasi, dan partikel confetti.
- 🧮 **Kalkulator Nilai:** 16 slot nilai dengan rata-rata instan dan konversi predikat (A–E) berbasis warna.
- 📅 **Jadwal Pelajaran:** Pengorganisasian jadwal otomatis urut hari (Senin–Sabtu).
- ⏳ **Countdown Ujian:** Penghitung mundur hari H ujian secara real-time.
- 💡 **Catatan Cepat:** Sticky notes ringkas dengan reward poin.
- 🔐 **Autentikasi Cloudflare D1 (SQLite):** Sistem registrasi, login, dan sinkronisasi poin ke database SQLite serverless edge global.

---

## 🛠️ Arsitektur Teknologi

- **Frontend:** HTML5, CSS3 (Neo-brutalism Pop Style), Vanilla JavaScript.
- **Backend:** Cloudflare Pages Functions (`/functions/api/`).
- **Database:** Cloudflare D1 (Serverless SQLite Dialect).
- **Hosting:** Cloudflare Pages (Deploy otomatis via GitHub).

---

## 📦 Struktur Proyek

```
LAWstudy/
├── index.html                   # Frontend aplikasi web lengkap
├── schema.sql                   # Skema database SQLite (D1)
├── wrangler.toml                # Konfigurasi Cloudflare Pages & D1 binding
├── package.json                 # Metadata & script development
├── .gitignore                   # File ignore git
├── functions/
│   └── api/
│       ├── register.js          # POST /api/register (Registrasi SQLite)
│       ├── login.js             # POST /api/login (Login SQLite)
│       ├── sync.js              # POST /api/sync (Sinkronisasi poin)
│       └── health.js            # GET /api/health (Status API & database)
└── README.md
```

---

## 🌐 Panduan Deployment ke Cloudflare Pages

### 1. Hubungkan Repository GitHub ke Cloudflare Pages
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Masuk ke menu **Workers & Pages** > **Create application** > tab **Pages** > **Connect to Git**.
3. Pilih repository GitHub ini (`alwilatjengke0405-alt/LAWstudy`).
4. Pada pengaturan build:
   - **Framework preset:** `None`
   - **Build command:** *(Kosongkan)*
   - **Build output directory:** `.`
5. Klik **Save and Deploy**.

---

### 2. Buat Database SQLite (Cloudflare D1)
1. Di sidebar Cloudflare Dashboard, buka menu **Workers & Pages** > **D1 SQL Database**.
2. Klik **Create database** > pilih **Dashboard**.
3. Beri nama database: `lawstudy-db` > klik **Create**.

---

### 3. Jalankan Skema SQLite (`schema.sql`)
1. Di halaman database `lawstudy-db` yang baru dibuat, buka tab **Console**.
2. Buka file `schema.sql` di repository ini, salin seluruh kodenya, lalu tempelkan (*paste*) ke Console D1 di Cloudflare:
   ```sql
   CREATE TABLE IF NOT EXISTS users (
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL,
       points INTEGER DEFAULT 0,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       last_login DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
   ```
3. Klik tombol **Execute**. Tabel `users` di database SQLite Anda kini sudah siap!

---

### 4. Hubungkan Database D1 ke Cloudflare Pages (Binding)
1. Buka project Pages Anda di Cloudflare Dashboard.
2. Masuk ke tab **Settings** > **Functions**.
3. Gulir ke bawah ke bagian **D1 Database Bindings** > klik **Add binding**:
   - **Variable name:** `DB` *(Wajib huruf kapital 'DB')*
   - **D1 database:** Pilih `lawstudy-db`
4. Klik **Save**.
5. Buka tab **Deployments**, klik titik tiga di samping deployment terakhir, lalu pilih **Retry deployment** (atau lakukan commit baru) agar binding aktif.

Selesai! Aplikasi Anda kini live secara global dengan database SQLite. 🎉

---

## 💻 Menjalankan Secara Lokal (Opsional)

Jika ingin menjalankan backend dan frontend di komputer lokal menggunakan Wrangler:

```bash
# Install dependencies
npm install

# Jalankan server lokal Cloudflare Pages Functions
npx wrangler pages dev . --d1 DB=lawstudy-db
```
Akses di browser melalui: `http://localhost:8788`.
