<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h4>Tentang Kami</h4>
        <p>Toko online terpercaya dengan produk berkualitas dan harga terjangkau.</p>
      </div>
      
      <div class="footer-section">
        <h4>Links</h4>
        <ul>
          <li><router-link to="/">Dashboard </router-link></li>
          <li><router-link to="/products">Produk</router-link></li>
          <li v-if="authStore.isAdmin"><router-link to="/admin">Admin Panel</router-link></li>
          <li v-if="authStore.isAuthenticated && !authStore.isAdmin"><router-link to="/orders">Pesanan</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Kontak</h4>
        <p>Email: info@eshop.com</p>
        <p>Telp: 021-1234567</p>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2026 E-Shop. All rights reserved.</p>
      <div class="footer-auth" v-if="!authStore.isAuthenticated">
        <router-link to="/login">Login</router-link>
        <span class="separator">|</span>
        <router-link to="/register">Daftar</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: rgb(0, 0, 0);
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: white;
}

.footer-section p {
  color: #ffffff;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: white;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid #34495e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
}

.footer-bottom p {
  margin: 0;
}

.footer-auth a {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s;
  margin: 0 0.5rem;
}

.footer-auth a:hover {
  color: white;
}

.footer-auth .separator {
  color: #34495e;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>