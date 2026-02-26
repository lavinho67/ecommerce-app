<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <h2>🛒 Toko Vino</h2>
        </router-link>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="nav-desktop" v-if="!isMobile">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/products" class="nav-link">Produk</router-link>
        <router-link v-if="authStore.isAuthenticated && !authStore.isAdmin" to="/orders" class="nav-link">Pesanan</router-link>
        <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link">Admin</router-link>
        <router-link 
          v-if="authStore.isAdmin" 
          to="/admin/orders" 
          class="nav-link"
        >
          📦 Kelola Pesanan
        </router-link>
      </nav>
      
      <!-- Desktop Search Bar -->
      <div class="navbar-center" v-if="!isMobile">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari produk..."
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch">🔍</button>
        </div>
      </div>
      
      <!-- Right Actions -->
      <div class="navbar-right">
        <!-- Desktop User Menu -->
        <div class="user-menu" v-if="!isMobile">
          <template v-if="authStore.isAuthenticated">
            <div class="user-dropdown">
              <button class="user-button" @click="toggleUserDropdown">
                <span class="user-avatar-circle">👤</span>
                <span class="user-name">{{ authStore.user?.name?.split(' ')[0] || 'User' }}</span>
                <span class="dropdown-arrow">{{ isUserDropdownOpen ? '▲' : '▼' }}</span>
              </button>
              
              <Transition name="dropdown">
                <div v-if="isUserDropdownOpen" class="dropdown-menu">
                  <div class="dropdown-header">
                    <div class="dropdown-user-info">
                      <span class="dropdown-user-name">{{ authStore.user?.name }}</span>
                      <span class="dropdown-user-email">{{ authStore.user?.email }}</span>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <router-link to="/profile" class="dropdown-item" @click="closeUserDropdown">
                    👤 Profil Saya
                  </router-link>
                  <div class="dropdown-divider"></div>
                  <button @click="handleLogout" class="dropdown-item logout-item">
                    🚪 Keluar
                  </button>
                </div>
              </Transition>
            </div>
          </template>
          
          <div v-else class="auth-buttons">
            <router-link to="/login" class="btn-login-outline">Login</router-link>
            <router-link to="/register" class="btn-register-solid">Daftar</router-link>
          </div>
        </div>

        <!-- Cart Icon -->
        <div v-if="!authStore.isAdmin" class="cart-icon" @click="toggleCart" title="Keranjang">
          <span v-if="cartTotalItems > 0" class="cart-count">{{ cartTotalItems }}</span>
          🛒
        </div>
        
        <!-- Mobile Icons -->
        <div class="mobile-actions" v-if="isMobile">
          <div class="search-icon-mobile" @click="toggleMobileSearch">🔍</div>
          <button class="hamburger" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Search -->
    <Transition name="slide-fade">
      <div v-if="isMobile && isMobileSearchOpen" class="mobile-search">
        <div class="search-bar-mobile">
          <input v-model="searchQuery" placeholder="Cari produk..." @keyup.enter="handleSearch">
          <button @click="handleSearch">Cari</button>
        </div>
      </div>
    </Transition>

    <!-- Mobile Menu -->
    <Transition name="drawer">
      <nav v-if="isMobile && isMobileMenuOpen" class="nav-mobile">
        <div class="mobile-menu-header">
          <template v-if="authStore.isAuthenticated">
            <div class="mobile-user-info">
              <div class="mobile-user-avatar">👤</div>
              <div class="mobile-user-text">
                <span class="mobile-user-name">{{ authStore.user?.name }}</span>
                <span class="mobile-user-email">{{ authStore.user?.email }}</span>
              </div>
            </div>
          </template>
          <div v-else class="mobile-auth-btns">
            <router-link to="/login" class="m-btn login" @click="closeMobileMenu">Login</router-link>
            <router-link to="/register" class="m-btn register" @click="closeMobileMenu">Daftar</router-link>
          </div>
        </div>

        <div class="mobile-links">
          <router-link to="/" class="m-link" @click="closeMobileMenu">🏠 Beranda</router-link>
          <router-link to="/products" class="m-link" @click="closeMobileMenu">🛍️ Produk</router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="m-link" @click="closeMobileMenu">📊 Admin</router-link>
          <router-link v-if="authStore.isAuthenticated && !authStore.isAdmin" to="/orders" class="m-link" @click="closeMobileMenu">📦 Pesanan</router-link>
          <router-link to="/profile" class="m-link" @click="closeMobileMenu">👤 Profil</router-link>
          <router-link v-if="authStore.isAuthenticated && !authStore.isAdmin" to="/cart" class="m-link" @click="closeMobileMenu">Keranjang</router-link>
          <template v-if="authStore.isAuthenticated">
            <button @click="handleLogout" class="m-link logout-btn">🚪 Keluar</button>
          </template>
        </div>
      </nav>
    </Transition>
    
    <div class="menu-overlay" v-if="isMobile && (isMobileMenuOpen || isMobileSearchOpen)" @click="closeAll"></div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { useRouter, useRoute } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const isMobileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const isUserDropdownOpen = ref(false)
const searchQuery = ref('')
const isMobile = ref(window.innerWidth <= 992)

const cartTotalItems = computed(() => cartStore.totalItems)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 992
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  if (route.query.q) searchQuery.value = route.query.q
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

watch(() => route.query.q, (newQ) => {
  searchQuery.value = newQ || ''
})

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const closeUserDropdown = () => {
  isUserDropdownOpen.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    closeAll()
    router.push({ name: 'products', query: { q: searchQuery.value } })
  }
}

const handleLogout = async () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    closeAll()
    await authStore.logout()
    toast.info('Anda telah keluar')
    router.push('/login')
  }
}

const toggleMobileSearch = () => {
  isMobileSearchOpen.value = !isMobileSearchOpen.value
  if (isMobileSearchOpen.value) isMobileMenuOpen.value = false
  closeUserDropdown()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) isMobileSearchOpen.value = false
  closeUserDropdown()
}

const toggleCart = () => {
  closeAll()
  router.push('/cart')
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const closeAll = () => {
  isMobileMenuOpen.value = false
  isMobileSearchOpen.value = false
  isUserDropdownOpen.value = false
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 100%);
  color: white;
  padding: 0.8rem 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}
/* Tambahkan di bagian style scoped */

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
}

.user-profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-text {
  font-size: 0.9rem;
  color: white;
}

.welcome-text strong {
  font-weight: 700;
  color: white;
}

.btn-logout-tiny {
  background: rgba(255, 71, 87, 0.9);
  border: none;
  color: white;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout-tiny:hover {
  background: #ff4757;
  transform: scale(1.05);
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.btn-login-outline {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 1.2rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50px;
  transition: all 0.3s;
}

.btn-login-outline:hover {
  background: white;
  color: #667eea;
  border-color: white;
}

.btn-register-solid {
  background: #48bb78;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.btn-register-solid:hover {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

/* Mobile Menu */
.mobile-guest-text {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

.user-info-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1a1a1a 0%, #b9b9b9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.user-text {
  flex: 1;
}

.u-name {
  display: block;
  font-weight: 700;
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.u-email {
  display: block;
  font-size: 0.8rem;
  color: #888;
}

.m-auth-btns {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.m-btn {
  flex: 1;
  text-align: center;
  padding: 0.8rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.m-btn.login {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.m-btn.login:hover {
  background: #667eea;
  color: white;
}

.m-btn.register {
  background: #48bb78;
  color: white;
  border: 2px solid #48bb78;
}

.m-btn.register:hover {
  background: #38a169;
  border-color: #38a169;
}

.mobile-links {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.m-link {
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #444;
  font-weight: 500;
  border-bottom: 1px solid #f1f1f1;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.m-link:hover {
  background: #f8f9fa;
  color: #667eea;
  padding-left: 2rem;
}

.m-link.logout-btn {
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  color: #ff4757;
  cursor: pointer;
  font-size: 1rem;
}

.m-link.logout-btn:hover {
  background: #fee;
}
/* 1. Logo */
.logo a {
  text-decoration: none;
  color: white;
  white-space: nowrap;
}

.logo h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -1px;
}

/* 2. Desktop Navigation */
.nav-desktop {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.nav-link.router-link-active {
  background: white;
  color: #000000;
}

/* 3. Search Bar Central */
.navbar-center {
  flex: 1;
  max-width: 400px;
}

.search-bar {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 3px 3px 3px 15px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-bar:focus-within {
  background: white;
  border-color: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.search-bar input {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  outline: none;
  font-size: 0.9rem;
}

.search-bar:focus-within input {
  color: #333;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-bar:focus-within input::placeholder {
  color: #999;
}

.search-bar button {
  background: white;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.search-bar:focus-within button {
  background: #667eea;
  color: white;
}

/* 4. Navbar Right Actions */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.btn-login-outline {
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.5rem 1.2rem;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 50px;
  transition: all 0.3s;
}

.btn-login-outline:hover {
  background: white;
  color: #667eea;
  border-color: white;
}

.btn-register-solid {
  background: #48bb78;
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.btn-register-solid:hover {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.user-profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 12px;
  border-radius: 50px;
}

.welcome-text {
  font-size: 0.85rem;
}

.btn-logout-tiny {
  background: #ff4757;
  border: none;
  color: white;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  transition: all 0.2s;
}

.cart-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.cart-count {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #764ba2;
}

/* Mobile Actions */
.mobile-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-icon-mobile {
  font-size: 1.4rem;
  padding: 8px;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.hamburger span {
  width: 100%;
  height: 2.5px;
  background: white;
  border-radius: 10px;
  transition: all 0.3s;
}

.hamburger.active span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

/* Mobile Search Bar */
.mobile-search {
  background: #764ba2;
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.search-bar-mobile {
  display: flex;
  gap: 0.5rem;
}

.search-bar-mobile input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
}

.search-bar-mobile button {
  background: white;
  color: #667eea;
  border: none;
  padding: 0 15px;
  border-radius: 8px;
  font-weight: bold;
}

/* Mobile Drawer */
.nav-mobile {
  position: fixed;
  top: 60px;
  right: 0;
  width: 280px;
  height: calc(100vh - 60px);
  background: white;
  color: #333;
  box-shadow: -5px 0 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.mobile-menu-header {
  padding: 2rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.user-info-box {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 45px;
  height: 45px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: white;
}

.u-name { display: block; font-weight: 700; color: #333; }
.u-email { display: block; font-size: 0.8rem; color: #777; }

.mobile-auth-prompt p { margin-bottom: 0.8rem; font-weight: 600; font-size: 0.9rem; }
.m-auth-btns { display: flex; gap: 0.5rem; }

.m-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.85rem;
}

.m-btn.login { border: 1px solid #667eea; color: #667eea; }
.m-btn.register { background: #667eea; color: white; }

.mobile-links {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.m-link {
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #444;
  font-weight: 600;
  border-bottom: 1px solid #f1f1f1;
  transition: background 0.2s;
}

.m-link:hover { background: #f8f9fa; color: #667eea; }

.logout-btn {
  background: transparent;
  border: none;
  text-align: left;
  color: #ff4757;
  cursor: pointer;
}

.menu-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
}

/* Transitions */
.drawer-enter-active, .drawer-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* Responsive adjustments */
@media (max-width: 992px) {
  .navbar-container { gap: 1rem; }
}
/* User Dropdown */
.user-dropdown {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.user-button:hover {
  background: rgba(255,255,255,0.25);
}

.user-avatar-circle {
  font-size: 1.2rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 0.8rem;
  opacity: 0.8;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-header {
  padding: 1.2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #b9b9b9 100%);
  color: white;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-user-name {
  font-weight: bold;
  font-size: 1rem;
}

.dropdown-user-email {
  font-size: 0.85rem;
  opacity: 0.9;
}

.dropdown-divider {
  height: 1px;
  background: #e0e0e0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 1.2rem;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.logout-item {
  color: #ff4757;
}

.logout-item:hover {
  background: #fee;
}

</style>