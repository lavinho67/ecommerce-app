<template>
  <div class="terms-view">
    <div class="terms-container">
      <h1>Syarat & Ketentuan</h1>
      <p class="last-updated">Terakhir diperbarui: 21 Februari 2026</p>

      <section class="terms-section">
        <h2>1. Ketentuan Umum</h2>
        <p>
          Dengan menggunakan layanan E-Shop, Anda menyetujui untuk terikat pada syarat dan 
          ketentuan yang berlaku. Harap baca seluruh ketentuan ini dengan saksama sebelum 
          menggunakan layanan kami.
        </p>
      </section>

      <section class="terms-section">
        <h2>2. Akun Pengguna</h2>
        <p>
          Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. 
          Seluruh aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda.
        </p>
      </section>

      <section class="terms-section">
        <h2>3. Pemesanan & Pembayaran</h2>
        <p>
          Semua harga yang tertera di E-Shop adalah dalam mata uang Rupiah (IDR). 
          Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. 
          Pembayaran harus dilakukan sesuai metode yang dipilih saat checkout.
        </p>
      </section>

      <section class="terms-section">
        <h2>4. Pengiriman</h2>
        <p>
          Estimasi waktu pengiriman bervariasi tergantung lokasi dan metode pengiriman 
          yang dipilih. E-Shop tidak bertanggung jawab atas keterlambatan yang disebabkan 
          oleh pihak kurir atau kondisi di luar kendali kami.
        </p>
      </section>

      <section class="terms-section">
        <h2>5. Pengembalian & Refund</h2>
        <p>
          Pengembalian barang dapat dilakukan dalam waktu 7 hari setelah barang diterima 
          dengan syarat barang masih dalam kondisi asli dan belum digunakan. 
          Refund akan diproses dalam 3-5 hari kerja setelah barang diterima kembali oleh kami.
        </p>
      </section>

      <section class="terms-section">
        <h2>6. Privasi & Keamanan Data</h2>
        <p>
          Kami menjaga kerahasiaan data pribadi Anda. Data yang kami kumpulkan hanya 
          digunakan untuk keperluan transaksi dan peningkatan layanan. 
          Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa persetujuan Anda.
        </p>
      </section>

      <section class="terms-section">
        <h2>7. Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, 
          silakan hubungi kami melalui email di 
          <a href="mailto:info@eshop.com">info@eshop.com</a> 
          atau telepon di 021-1234567.
        </p>
      </section>

      <div class="back-link">
        <router-link to="/">← Kembali ke Beranda</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
}

.terms-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.last-updated {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.terms-section {
  margin-bottom: 2rem;
}

.terms-section h2 {
  color: #667eea;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.terms-section p {
  color: #555;
  line-height: 1.8;
  font-size: 0.95rem;
}

.terms-section a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.terms-section a:hover {
  text-decoration: underline;
}

.back-link {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.back-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.back-link a:hover {
  color: #5a6fd6;
}

@media (max-width: 768px) {
  .terms-container {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
