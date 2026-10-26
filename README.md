# Website Kasir

Website Kasir adalah aplikasi berbasis web sederhana yang digunakan untuk membantu pengelolaan aktivitas kasir, pencatatan absensi karyawan, serta pengelolaan reservasi pelanggan restoran.

Aplikasi ini dibuat menggunakan HTML, CSS, dan JavaScript. Data absensi dan reservasi disimpan menggunakan `localStorage` pada browser.

## Fitur Utama

### 1. Beranda
Halaman utama yang menampilkan ringkasan informasi, meliputi:
- Total reservasi pelanggan.
- Jumlah kasir yang hadir.
- Jumlah reservasi yang masih menunggu.
- Total pendapatan berdasarkan data reservasi.
- Daftar reservasi terbaru.

### 2. Absensi Kasir
Halaman untuk membantu pencatatan kehadiran kasir dengan fitur:
- Menambahkan data karyawan.
- Mencatat nama dan jabatan karyawan.
- Mencatat status kehadiran.
- Mengubah dan menghapus data absensi.
- Mencari data karyawan.
- Melihat ringkasan jumlah karyawan berdasarkan status kehadiran.

### 3. Cek Reservasi
Halaman untuk mengelola reservasi pelanggan dengan fitur:
- Menambahkan reservasi pelanggan.
- Memasukkan nama pelanggan.
- Memilih nomor meja.
- Memasukkan jumlah tamu.
- Menentukan tanggal reservasi.
- Memilih menu makanan dan minuman.
- Menghitung total harga pesanan secara otomatis.
- Melihat daftar reservasi pelanggan.
- Mencari data reservasi.
- Mengubah status reservasi menjadi dikonfirmasi, selesai, atau dibatalkan.

## Teknologi yang Digunakan

- **HTML5** — Membuat struktur halaman website.
- **CSS3** — Mengatur tampilan dan tata letak website.
- **JavaScript** — Mengatur interaksi, penghitungan harga, dan pengelolaan data.
- **LocalStorage** — Menyimpan data absensi dan reservasi pada browser.

## Struktur Folder

```text
website-kasir/
├── index.html
├── absensi.html
├── reservasi.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

Keterangan:

| File/Folder | Fungsi |
|---|---|
| `index.html` | Halaman utama atau Beranda. |
| `absensi.html` | Halaman pencatatan absensi kasir. |
| `reservasi.html` | Halaman pengelolaan reservasi pelanggan. |
| `css/style.css` | Mengatur desain dan tampilan seluruh halaman. |
| `js/script.js` | Menangani interaksi, perhitungan, dan penyimpanan data. |
| `README.md` | Dokumentasi proyek. |

## Cara Menjalankan Website

1. Unduh atau salin seluruh file proyek ke komputer.
2. Buka folder proyek menggunakan Visual Studio Code.
3. Pastikan struktur folder sesuai dengan dokumentasi di atas.
4. Pastikan setiap file HTML memanggil CSS dan JavaScript dengan alamat yang benar.
5. Buka file `index.html` menggunakan browser.

Untuk pengalaman pengembangan yang lebih praktis, kamu dapat menggunakan ekstensi **Live Server** di Visual Studio Code.

### Menjalankan dengan Live Server

1. Buka Visual Studio Code.
2. Buka folder proyek `website-kasir`.
3. Pasang ekstensi Live Server jika belum tersedia.
4. Klik kanan file `index.html`.
5. Pilih **Open with Live Server**.
6. Website akan terbuka di browser.

## Penyimpanan Data

Aplikasi ini menggunakan `localStorage` untuk menyimpan data absensi dan reservasi.

Artinya:
- Data dapat tetap tersedia ketika halaman dimuat ulang pada browser yang sama.
- Data tidak otomatis tersinkronisasi dengan perangkat atau browser lain.
- Data dapat hilang jika penyimpanan browser dihapus.
- Aplikasi belum menggunakan database atau backend server.

## Catatan Pengembangan

Website ini merupakan aplikasi kasir sederhana berbasis frontend. Untuk penggunaan operasional dengan banyak pengguna, pengembangan lebih lanjut dapat mencakup:

- Integrasi database seperti MySQL.
- Backend menggunakan PHP atau Laravel.
- Sistem login dan autentikasi pengguna.
- Pengelolaan transaksi pembayaran.
- Laporan pendapatan harian dan bulanan.
- Pengelolaan data karyawan dan reservasi secara terpusat.

## Status Proyek

**Status:** Pengembangan awal.

**Jenis aplikasi:** Website berbasis frontend.

**Tujuan:** Membantu pengelolaan informasi kasir, absensi karyawan, dan reservasi pelanggan restoran.
