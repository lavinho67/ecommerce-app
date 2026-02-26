<template>
  <div class="home">
    <section class="hero" :style="{ backgroundImage: 'url(' + heroImage + ')' }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Selamat Datang di Toko Vino</h1>
        <p>Temukan produk terbaik dengan harga terjangkau</p>
        <router-link to="/products" class="btn-primary">Lihat Produk</router-link>
      </div>
    </section>
    
    <section class="features">
      <div class="feature">
        <span class="feature-icon">🚚</span>
        <h3>Gratis Ongkir</h3>
        <p>Untuk pembelian di atas Rp 500.000</p>
      </div>
      <div class="feature">
        <span class="feature-icon">🔒</span>
        <h3>Pembayaran Aman</h3>
        <p>Transaksi terenkripsi dan aman</p>
      </div>
      <div class="feature">
        <span class="feature-icon">⭐</span>
        <h3>Produk Berkualitas</h3>
        <p>100% original dan bergaransi</p>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref } from 'vue'

// Ganti dengan URL gambar yang Anda inginkan
const heroImage = ref('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')

// Atau jika gambar lokal, simpan di folder public/images/
// const heroImage = ref('/images/hero-bg.jpg')
</script>
<style scoped>
.home {
  min-height: 100vh;
  background-color: #1a1a1a;
}

.hero {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: rgb(255, 255, 255);
  text-align: center;
  padding: 8rem 10rem;
  min-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Overlay gelap agar teks terbaca */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: white;
  color: #333;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  background: #f8f9fa;
}

.features {
  max-width: 1200px;
  background-color: #1a1a1a;
  margin: 4rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  background-color: #202020;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(177, 105, 105, 0.1);
  transition: all 0.3s;
}

.feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(117, 117, 117, 0.2);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.feature h3 {
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.feature p {
  color: #ffffff;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>