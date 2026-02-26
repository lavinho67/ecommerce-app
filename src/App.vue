<template>
  <div id="app">
    <!-- Navbar hanya tampil jika bukan halaman auth -->
    <Navbar v-if="!isAuthPage" />
    
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- Footer hanya tampil jika bukan halaman auth -->
    <Footer v-if="!isAuthPage" />
    
    <ToastNotification />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const cartStore = useCartStore()

// Cek apakah halaman saat ini adalah halaman auth (login/register)
const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'register'
})

// Load cart dari localStorage saat aplikasi dimulai
import { onMounted } from 'vue'
onMounted(() => {
  cartStore.loadCartFromLocalStorage()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #1a1a1a;
}

.main-content {
  min-height: calc(100vh - 300px);
}

/* Style untuk halaman auth (tanpa navbar) */
.router-view {
  min-height: 100vh;
}
</style>