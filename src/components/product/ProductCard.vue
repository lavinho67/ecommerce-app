<template>
  <div class="product-card">
<div class="product-image">
  <img :src="product.image" :alt="product.name">

  <!-- Kalau stok habis -->
  <span v-if="product.stock <= 0" class="out-of-stock">
    Stok Habis
  </span>

  <!-- Kalau stok ada dan bukan admin -->
  <button 
    v-else-if="!authStore.isAdmin" 
    @click="addToCart" 
    class="quick-add">
    + Tambah
  </button>
</div>
    
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p class="product-price">{{ formatRupiahWithPrefix(product.price) }}</p>
      <p class="product-description">{{ product.description.substring(0, 60) }}</p>
      
      <div class="product-footer">
        <span class="product-category">
          {{ product.category?.icon || '' }} {{ product.category?.name || product.category }}
        </span>
        <button @click="viewDetail" class="btn-detail">Detail</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { formatRupiahWithPrefix } from '@/utils/formatter'
import { useAuthStore } from '@/stores/authStore'
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const addToCart = () => {
  cartStore.addToCart(props.product)
  toast.success(`${props.product.name} ditambahkan ke keranjang!`)
}

const viewDetail = () => {
  router.push(`/product/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  background: rgb(43, 43, 43);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.quick-add {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 16px;
  background: #00000000;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.quick-add:hover {
  background: #36343488;
  transform: scale(1.05);
}

.out-of-stock {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 16px;
  background: #c00;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
}

.product-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #ffffff;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-category {
  background: #535353;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #ffffff;
}

.btn-detail {
  padding: 6px 12px;
  background: rgb(68, 68, 68);
  color: #ffffff;
  border: 2px solid #000000;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-detail:hover {
  background: #0f0f0f;
  color: white;
}
</style>