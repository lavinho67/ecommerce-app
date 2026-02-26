# 🛒 E-Commerce App - Frontend

Aplikasi frontend untuk toko online dengan fitur lengkap keranjang belanja, checkout, dan manajemen produk. Dibangun dengan Vue.js 3, Pinia, dan Vue Router.

## ✨ Fitur Aplikasi

### Untuk Pengguna (User)
- 🔐 **Autentikasi** - Register, Login, Logout
- 🏠 **Halaman Utama** - Hero section dengan gambar background
- 🛍️ **Daftar Produk** - Filter, pencarian, dan sorting produk
- 📦 **Detail Produk** - Lihat informasi lengkap dan pilih jumlah
- 🛒 **Keranjang Belanja** - Tambah, edit, hapus item
- 💳 **Checkout** - Form pengiriman dengan auto-fill dari profil
- 👤 **Profil User** - Data diri, alamat, dan keamanan
- 📱 **Riwayat Pesanan** - Lihat status pesanan

### Untuk Admin
- 📊 **Dashboard Admin** - Statistik produk
- ➕ **Tambah Produk** - Upload gambar, kategori, stok, harga
- ✏️ **Edit Produk** - Update informasi produk
- 🗑️ **Hapus Produk** - Hapus produk dari database

## 🛠️ Teknologi yang Digunakan

| Bagian | Teknologi |
|--------|-----------|
| **Frontend Framework** | Vue 3 |
| **State Management** | Pinia |
| **Routing** | Vue Router |
| **HTTP Client** | Axios |
| **Styling** | CSS3 (scoped) |
| **Build Tool** | Vite |
| **Formatting** | Prettier, ESLint |

## 📸 Screenshot Aplikasi

*Tambahkan screenshot di sini*

| Halaman | Screenshot |
|---------|------------|
| Home | ![Home](link-gambar) |
| Produk | ![Produk](link-gambar) |
| Keranjang | ![Keranjang](link-gambar) |
| Checkout | ![Checkout](link-gambar) |
| Admin | ![Admin](link-gambar) |

## 🚀 Cara Menjalankan di Lokal

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- npm atau yarn

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/ecommerce-app.git

# 2. Masuk ke folder proyek
cd ecommerce-app

# 3. Install dependencies
npm install

# 4. Buat file environment
cp .env.example .env
# Edit .env dan isi VITE_API_URL dengan URL backend Anda

# 5. Jalankan development server
npm run dev

# 6. Buka browser di http://localhost:5173
```

## 🌐 Deployment

Frontend aplikasi ini di-deploy di **Netlify**:
- 🔗 **URL Live**: [https://fayewebster.netlify.app](https://fayewebster.netlify.app)

### Backend
Backend menggunakan **Laravel 9** dengan database MySQL. Untuk development, backend dijalankan via **Ngrok**:
- 🔗 **Backend API**: `https://retiform-wilda-motivelessly.ngrok-free.app/api`

## 📁 Struktur Folder

```
src/
├── assets/          # Gambar dan file statis
├── components/      # Komponen Vue
│   ├── layout/      # Navbar, Footer
│   ├── product/     # ProductCard, dll
│   └── ui/          # ToastNotification
├── views/           # Halaman-halaman
├── stores/          # Pinia stores
├── services/        # API services
├── router/          # Vue Router
├── utils/           # Helper functions
├── App.vue
└── main.js
```

## 👨‍💻 Author

- **Nama**: [Nama Anda]
- **GitHub**: [@username](https://github.com/username)
- **Email**: email@anda.com

## 📝 Lisensi

Proyek ini menggunakan lisensi **MIT** - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- Vue.js team
- Laravel team
- OpenWeatherMap API (untuk fitur cuaca di proyek sebelumnya)