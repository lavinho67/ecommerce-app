<template>
  <div class="product-detail">
    <div v-if="productStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Memuat produk...</p>
    </div>
    
    <div v-else-if="!product" class="not-found">
      <h2>Produk Tidak Ditemukan</h2>
      <p>Produk yang Anda cari mungkin sudah tidak tersedia.</p>
      <router-link to="/products" class="btn-primary">Lihat Produk Lain</router-link>
    </div>
    
    <div v-else class="product-container">
      <div class="product-images">
        <img :src="product.image" :alt="product.name" class="main-image">
      </div>
      
      <div class="product-info">
        <div class="breadcrumb">
          <router-link to="/products">Produk</router-link> &gt;
          <span>{{ product.category?.name || product.category }}</span>
        </div>
        
        <h1>{{ product.name }}</h1>
        
        <div class="product-meta">
        <span class="category">
          {{ product.category?.icon || '' }} {{ product.category?.name || product.category }}
        </span>
          <span class="stock" :class="{ 'low-stock': product.stock < 10 }">
            Stok: {{ product.stock }}
          </span>
        </div>
        
        <div class="product-price">
          <span class="price-value">{{ formatRupiahWithPrefix(product.price) }}</span>
        </div>
        
        <div class="product-description">
          <h3>Deskripsi Produk</h3>
          <p>{{ product.description }}</p>
        </div>
        
<div class="product-actions" v-if="!authStore.isAdmin">

  <!-- Jika stok habis -->
  <button 
    v-if="product.stock === 0"
    class="btn-add-to-cart"
    disabled
  >
    Stok Habis
  </button>

  <!-- Jika bisa beli -->
  <template v-else>
    <div class="quantity-selector">
      <button @click="decreaseQuantity" class="qty-btn">-</button>
      <span class="qty-value">{{ quantity }}</span>
      <button @click="increaseQuantity" class="qty-btn">+</button>
    </div>

    <button 
      @click="addToCart" 
      class="btn-add-to-cart"
    >
      🛒 Tambah ke Keranjang
    </button>
  </template>

</div>
        
        <div class="product-extra">
          <div class="extra-item">
            <span>🚚</span>
            <span>Gratis ongkir untuk pembelian di atas Rp 500.000</span>
          </div>
          <div class="extra-item">
            <span>🔒</span>
            <span>Pembayaran aman & terenkripsi</span>
          </div>
          <div class="extra-item">
            <span>⭐</span>
            <span>Garansi 100% produk original</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/composables/useToast'
import { formatRupiahWithPrefix } from '@/utils/formatter'
import { useAuthStore } from '@/stores/authStore'
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const toast = useToast()
const authStore = useAuthStore()
const quantity = ref(1)
const productId = computed(() => parseInt(route.params.id))

const product = computed(() => {
  return productStore.getProductById(productId.value)
})

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
})

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
const canBuy = computed(() => {
  return product.value &&
         product.value.stock > 0 &&
         !authStore.isAdmin
})

const addToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  toast.success(`${quantity.value} ${product.value.name} ditambahkan ke keranjang!`)
  router.push('/cart')
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-found {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.not-found h2 {
  color: #333;
  margin-bottom: 1rem;
}

.not-found p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.breadcrumb {
  color: #888;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #667eea;
  text-decoration: none;
}

.product-info h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.product-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.category {
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
}

.stock {
  font-size: 0.9rem;
  color: #48bb78;
}

.stock.low-stock {
  color: #f39c12;
}

.product-price {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

/* .price-label {
  display: block;
  color: #666;
  margin-bottom: 0.5rem;
} */

.price-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.product-description {
  line-height: 1.8;
  color: #666;
}

.product-description h3 {
  color: #333;
  margin-bottom: 1rem;
}

.product-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
}

.qty-btn:hover {
  background: #e0e0e0;
}

.qty-value {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.btn-add-to-cart {
  flex: 1;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-to-cart:hover:not(:disabled) {
  background: #5a6fd6;
  transform: translateY(-2px);
}

.btn-add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.product-extra {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.extra-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
  
  .product-info h1 {
    font-size: 1.5rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .quantity-selector {
    width: 100%;
    justify-content: center;
  }
}
</style>