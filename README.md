# 🍽️ YummyGo! - Smart Canteen (Kantin Pintar)

Website sistem pemesanan online kantin pintar modern, efisien, dan profesional. Dirancang khusus untuk memangkas antrean panjang saat jam istirahat sekolah, memudahkan siswa memesan lebih awal, dan mempermudah pihak pengelola kantin mengelola stok, menerima pembayaran (Cash / QRIS), serta memproses pesanan.

---

## 🌟 Sistem Autentikasi Pengguna Ganda (Siswa & Penjual)

### 🧑‍🎓 1. Autentikasi & Akun Siswa (Pembeli)
* **Masuk (Login) & Daftar Baru (Register)**:
  * Siswa dapat login menggunakan **NIS (Nomor Induk Siswa)** atau Nama Siswa.
  * Pendaftaran siswa baru lengkap dengan Nama Lengkap, NIS, Kelas / Jurusan (misal: *XII RPL 1*), No. WhatsApp, dan Kata Sandi.
* **Akun Demo Cepat (1-Klik)** untuk Pengujian Langsung:
  * 🧑 **Budi Santoso** — NIS: `202401` (XII RPL 1)
  * 👩 **Siti Rahmawati** — NIS: `202402` (XI MIPA 2)
  * 🧑 **Rian Pratama** — NIS: `202403` (X DKV 3)
  * *Kata sandi default siswa:* `123`
* **Keuntungan Akun Siswa**:
  * Data identitas (Nama Siswa & Kelas) **otomatis terisi saat checkout keranjang**.
  * Sapaan personal di Hero Banner (*"Hai, Budi Santoso (XII RPL 1) 👋"*).
  * Profil dropdown di navigasi atas dengan opsi ganti akun atau keluar.

---

### 👩‍🍳 2. Autentikasi Pengelola Kantin (Penjual)
* **Akses Keamanan Staf**:
  * Hanya pihak penjual/staf kantin berwenang yang dapat membuka panel dapur, mengubah stok, menambah menu, dan memvalidasi pembayaran.
  * **Kata Sandi Staf Default:** `kantin123`
  * Tersedia tombol uji cepat **"Masuk Cepat sebagai Pengelola Kantin"** di modal login.
  * Kata sandi staf dapat diganti kapan saja melalui tab **Pengaturan Kantin**.
  * Sesi staf dilengkapi tombol **"Keluar Staf"** yang aman.

---

## 🌟 Fitur Utama Lainnya

### 🍔 Pengalaman Siswa (Pembeli)
* **Katalog Menu Interaktif**:
  * Kategori: Makanan Berat, Snack & Camilan, Minuman Segar, dan Menu Sehat.
  * Kartu menu bergaya *modern food app*: rating bintang (⭐ 4.9), ulasan, waktu saji, badge terlaris, sisa porsi stok, dan tombol pesan cepat.
  * Pencarian instan dan filter ketersediaan stok produk.
* **Panduan Visual "Cara Pesan & Ambil di Kantin"**:
  * 4 langkah mudah: *Pilih Menu* ➔ *Tentukan Jam Ambil* ➔ *Bayar Cash / QRIS* ➔ *Ambil Tanpa Antre*.
* **Keranjang Belanja Pintar**:
  * Pilihan waktu pengambilan: Istirahat 1 (09:45), Istirahat 2 (12:00), atau Segera.
  * Opsi Pembayaran:
    * 💵 **Tunai / Cash**: Bayar di kasir loket saat makanan diambil.
    * 📱 **QRIS Kantin**: Scan QRIS dari aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay, BCA, dll.) dengan nominal pas dan simulasi pembayaran instan.
* **Tiket Pengambilan Resmi**:
  * Menampilkan **Nomor Antrean Unik** (misal: `#YG-108`) dan **PIN Pengambilan 4-Digit** (misal: `8492`).
* **Lacak Status Pesanan & Banner Mengambang**:
  * Status real-time: `Diterima` ➔ `Sedang Dimasak` ➔ `Siap Diambil di Loket` ➔ `Selesai`.
  * *Floating notification banner* di pojok layar siswa saat memiliki pesanan aktif.

---

### 👩‍🍳 Pengalaman Pengelola Kantin (Penjual)
* **Dashboard Metrik & Dapur (Kitchen Display System)**:
  * Total omzet pendapatan masuk, total pesanan, antrean yang perlu dimasak, dan peringatan stok menipis.
  * Kolom filter status pesanan dan aksi satu klik: *Terima & Mulai Masak*, *Tandai Siap Diambil*, *Selesaikan Penyerahan*.
  * Tombol validasi uang tunai di kasir loket.
* **Verifikasi Pengambilan Cepat (Cashier Quick-Check)**:
  * Input PIN 4-digit atau Nomor Antrean siswa di bar atas dashboard untuk langsung memvalidasi penyerahan makanan.
* **Kelola Menu & Stok Produk**:
  * Tambah menu baru dengan preset foto kantin otomatis, tombol edit stok (+ / -), saklar *Tersedia / Habis*, dan hapus menu.
* **Pengaturan Toko**:
  * Saklar buka/tutup toko, jam istirahat, nama loket, pengumuman berjalan, dan penggantian kata sandi staf.

---

## 💻 Sinkronisasi Multi-Tab Real-Time
Aplikasi dilengkapi dengan `BroadcastChannel` dan `localStorage`:
* Buka **Tab 1** (Siswa) dan **Tab 2** (Staf Kantin).
* Begitu siswa checkout di Tab 1, layar pengelola kantin di Tab 2 langsung berbunyi bel dan pesanan baru muncul secara otomatis tanpa perlu refresh!

---

## 🚀 Cara Menjalankan

1. Buka terminal di folder project:
   ```bash
   npm run dev
   ```
2. Buka browser di:
   ```
   http://localhost:3000
   ```
