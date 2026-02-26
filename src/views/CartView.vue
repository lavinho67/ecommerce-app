<template>
  <div class="cart-view">
    <h1>Keranjang Belanja</h1>
    
    <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
      <p>Keranjang belanja Anda kosong</p>
      <router-link to="/products" class="btn-primary">Belanja Sekarang</router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartStore.cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-image">
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-price">{{ formatRupiahWithPrefix(item.price) }}</p>
            <p class="item-stock" :class="{ 'low-stock': item.stock <= 5, 'out-of-stock': item.stock <= 0 }">
              Stok: {{ item.stock ?? 'N/A' }}
            </p>
            <p v-if="item.quantity >= item.stock" class="stock-warning">
              ⚠️ Jumlah melebihi/sama dengan stok tersedia
            </p>
          </div>
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="qty-btn" :disabled="item.quantity >= item.stock" :class="{ 'qty-btn-disabled': item.quantity >= item.stock }">+</button>
          </div>
          <div class="item-total">
            {{ formatRupiahWithPrefix(item.price * item.quantity) }}
          </div>
          <button @click="removeItem(item.id)" class="remove-btn">✕</button>
        </div>
      </div>
      
      <div class="cart-summary">
        <h3>Ringkasan Belanja</h3>
        <div class="summary-row">
          <span>Total Item:</span>
          <span>{{ cartStore.totalItems }}</span>
        </div>
        <div class="summary-row total">
          <span>Total Harga:</span>
          <span>{{ cartStore.formattedTotalPrice }}</span>
        </div>
        <button class="btn-checkout" @click="goToCheckout">Checkout</button>      
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { formatRupiahWithPrefix } from '@/utils/formatter'

const router = useRouter()
const cartStore = useCartStore()

const increaseQuantity = (item) => {
  if (item.quantity >= item.stock) return
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity - 1)
}
const goToCheckout = () => {
  router.push('/checkout')
}
const removeItem = (id) => {
  cartStore.removeFromCart(id)
}


</script>

<style scoped>
.cart-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

h1 {
  color: #e6e6e6;
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.empty-cart p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #5a6fd6;
  transform: translateY(-2px);
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.cart-item {
  display: grid;
  grid-template-columns: auto 2fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.item-price {
  color: #667eea;
  font-weight: bold;
}

.item-stock {
  font-size: 0.85rem;
  color: #48bb78;
  font-weight: 600;
  margin-top: 0.25rem;
}

.item-stock.low-stock {
  color: #ed8936;
}

.item-stock.out-of-stock {
  color: #e53e3e;
}

.stock-warning {
  font-size: 0.78rem;
  color: #e53e3e;
  margin-top: 0.2rem;
  font-weight: 500;
}

.qty-btn-disabled {
  opacity: 0.4;
  cursor: not-allowed !important;
  background: #e0e0e0 !important;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
}

.qty-btn:hover {
  background: #f0f0f0;
}

.item-total {
  font-weight: bold;
  color: #333;
  min-width: 100px;
  text-align: right;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #fee;
  color: #c00;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.remove-btn:hover {
  background: #fdd;
}

.cart-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: fit-content;
}

.cart-summary h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.summary-row.total {
  border-bottom: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.btn-checkout {
  width: 100%;
  padding: 1rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.btn-checkout:hover {
  background: #38a169;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .item-image {
    margin: 0 auto;
  }
  
  .item-total {
    text-align: center;
  }
}
</style>