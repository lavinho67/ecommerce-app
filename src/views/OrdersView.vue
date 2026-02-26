<template>
  <div class="orders-view">
    <h1>Riwayat Pesanan</h1>
    
    <div v-if="orderStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Memuat pesanan...</p>
    </div>
    
    <div v-else-if="orderStore.orders.length === 0" class="empty-orders">
      <p>Belum ada pesanan</p>
      <router-link to="/products" class="btn-primary">Belanja Sekarang</router-link>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orderStore.orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-id">
            <strong>Order:</strong> {{ order.order_number }}
          </div>
          <div class="order-date">
            {{ formatDate(order.created_at) }}
          </div>
          <div class="order-status" :class="order.status">
            {{ getStatusText(order.status) }}
          </div>
        </div>
        
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.product.image" :alt="item.product.name" class="item-image">
            <div class="item-details">
              <h4>{{ item.product.name }}</h4>
              <p>{{ item.quantity }} x {{ formatRupiahWithPrefix(item.price) }}</p>
            </div>
            <div class="item-total">
              {{ formatRupiahWithPrefix(item.price * item.quantity) }}
            </div>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="order-address">
            <strong>Tujuan:</strong> {{ order.shipping_address }}
          </div>
          <div class="order-total">
            <strong>Total:</strong> {{ formatRupiahWithPrefix(order.grand_total) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'
import { formatRupiahWithPrefix } from '@/utils/formatter'

const orderStore = useOrderStore()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAuthenticated) {
    orderStore.loadOrders()
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '⏳ Menunggu',
    processed: '📦 Diproses',
    shipped: '🚚 Dikirim',
    delivered: '✅ Diterima',
    cancelled: '❌ Dibatalkan'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.orders-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
}

h1 {
  margin-bottom: 2rem;
  color: #ffffff;
}

.empty-orders {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.empty-orders p {
  color: #666;
  margin-bottom: 1.5rem;
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.order-status.pending {
  background: #fff3e0;
  color: #e65100;
}

.order-status.processed {
  background: #e3f2fd;
  color: #0d47a1;
}

.order-status.shipped {
  background: #e8f5e9;
  color: #1b5e20;
}

.order-status.delivered {
  background: #e8f5e9;
  color: #2e7d32;
}

.order-items {
  padding: 1.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.order-info {
  display: flex;
  flex-direction: column;
}

.order-number {
  font-weight: bold;
  color: #333;
}

.order-date {
  font-size: 0.85rem;
  color: #888;
}

.item-details h4 {
  margin: 0;
  font-size: 1rem;
}

.item-total-price {
  font-weight: 600;
  color: #333;
}

.shipping-info p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
  color: #666;
}

.total-info {
  min-width: 200px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  color: #666;
}

.grand-total {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  font-weight: bold;
  font-size: 1.1rem;
  color: #667eea;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .order-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 1.5rem;
  }

  .total-info {
    min-width: 100%;
  }
}
</style>