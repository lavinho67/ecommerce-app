<template>
  <div class="admin-orders">
    <div class="page-header">
      <h1>📦 Manajemen Pesanan</h1>
      <p>Kelola semua pesanan dari pelanggan</p>
    </div>
    
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">📋</div>
        <div class="stat-info">
          <span class="stat-value">{{ totalOrders }}</span>
          <span class="stat-label">Total Pesanan</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon pending">⏳</div>
        <div class="stat-info">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">Menunggu</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon processed">📦</div>
        <div class="stat-info">
          <span class="stat-value">{{ processedCount }}</span>
          <span class="stat-label">Diproses</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon delivered">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ deliveredCount }}</span>
          <span class="stat-label">Selesai</span>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari order ID atau nama customer..."
          class="search-input"
        >
      </div>
      
      <div class="filter-group">
        <select v-model="statusFilter" class="filter-select">
          <option value="">Semua Status</option>
          <option value="pending">⏳ Menunggu</option>
          <option value="processed">📦 Diproses</option>
          <option value="shipped">🚚 Dikirim</option>
          <option value="delivered">✅ Diterima</option>
          <option value="cancelled">❌ Dibatalkan</option>
        </select>
        
        <select v-model="dateFilter" class="filter-select">
          <option value="all">Semua Waktu</option>
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
        </select>
        
        <button @click="refreshData" class="btn-refresh" title="Refresh">
          🔄
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="adminOrderStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Memuat pesanan...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="adminOrderStore.error" class="error">
      <p>{{ adminOrderStore.error }}</p>
      <button @click="refreshData" class="btn-retry">Coba Lagi</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="empty">
      <p>Tidak ada pesanan ditemukan</p>
    </div>
    
    <!-- Orders Table -->
    <div v-else class="table-responsive">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Tanggal</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="order-row">
            <td class="order-id">{{ order.order_number }}</td>
            <td>{{ adminOrderStore.formatDate(order.created_at) }}</td>
            <td>
              <div class="customer-info">
                <span class="customer-name">{{ order.user?.name || 'Unknown' }}</span>
                <span class="customer-email">{{ order.user?.email || '-' }}</span>
              </div>
            </td>
            <td class="order-total">{{ formatRupiahWithPrefix(order.grand_total) }}</td>
            <td>
              <span :class="['status-badge', adminOrderStore.getStatusBadgeClass(order.status)]">
                {{ adminOrderStore.getStatusText(order.status) }}
              </span>
            </td>
            <td>
              <button @click="viewOrderDetail(order)" class="btn-view">
                👁️ Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Detail Order -->
    <div v-if="showDetailModal" class="modal" @click.self="closeDetailModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Detail Pesanan</h2>
          <button @click="closeDetailModal" class="btn-close">✕</button>
        </div>
        
        <div v-if="selectedOrder" class="order-detail">
          <!-- Order Info -->
          <div class="detail-section">
            <h3>Informasi Pesanan</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Order ID:</span>
                <span class="value">{{ selectedOrder.order_number }}</span>
              </div>
              <div class="info-item">
                <span class="label">Tanggal:</span>
                <span class="value">{{ adminOrderStore.formatDate(selectedOrder.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Status:</span>
                <div class="status-control">
                  <select v-model="statusEdit" class="status-select">
                    <option value="pending">⏳ Menunggu</option>
                    <option value="processed">📦 Diproses</option>
                    <option value="shipped">🚚 Dikirim</option>
                    <option value="delivered">✅ Diterima</option>
                    <option value="cancelled">❌ Dibatalkan</option>
                  </select>
                  <button 
                    @click="updateStatus(selectedOrder.id)" 
                    class="btn-update-status"
                    :disabled="statusEdit === selectedOrder.status"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Customer Info -->
          <div class="detail-section">
            <h3>Informasi Pelanggan</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Nama:</span>
                <span class="value">{{ selectedOrder.user?.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{ selectedOrder.user?.email }}</span>
              </div>
              <div class="info-item full-width">
                <span class="label">Alamat:</span>
                <span class="value">{{ selectedOrder.shipping_address }}</span>
              </div>
              <div class="info-item">
                <span class="label">Metode Bayar:</span>
                <span class="value">{{ formatPaymentMethod(selectedOrder.payment_method) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Metode Kirim:</span>
                <span class="value">{{ formatShippingMethod(selectedOrder.shipping_method) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="detail-section">
            <h3>Item Pesanan</h3>
            <div class="items-list">
              <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
                <div class="item-image">
                  <img 
                    :src="item.product?.image || 'https://via.placeholder.com/60'"
                    :alt="item.product?.name"
                    @error="handleImageError"
                  >
                </div>
                <div class="item-info">
                  <h4>{{ item.product?.name || 'Produk' }}</h4>
                  <p>{{ item.quantity }} x {{ formatRupiahWithPrefix(item.price) }}</p>
                </div>
                <div class="item-total">
                  {{ formatRupiahWithPrefix(item.price * item.quantity) }}
                </div>
              </div>
            </div>
            
            <div class="order-totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>{{ formatRupiahWithPrefix(selectedOrder.total_price) }}</span>
              </div>
              <div class="total-row">
                <span>Ongkos Kirim:</span>
                <span>{{ formatRupiahWithPrefix(selectedOrder.shipping_cost) }}</span>
              </div>
              <div class="total-row grand-total">
                <span>Total:</span>
                <span>{{ formatRupiahWithPrefix(selectedOrder.grand_total) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          <div v-if="selectedOrder.notes" class="detail-section">
            <h3>Catatan</h3>
            <p class="notes">{{ selectedOrder.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminOrderStore } from '@/stores/adminOrderStore'
import { formatRupiahWithPrefix } from '@/utils/formatter'

const adminOrderStore = useAdminOrderStore()

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('all')
const showDetailModal = ref(false)
const selectedOrder = ref(null)
const statusEdit = ref('')

// Statistics
const totalOrders = computed(() => adminOrderStore.orders.length)

const pendingCount = computed(() => {
  return adminOrderStore.orders.filter(o => o.status === 'pending').length
})

const processedCount = computed(() => {
  return adminOrderStore.orders.filter(o => ['processed', 'shipped'].includes(o.status)).length
})

const deliveredCount = computed(() => {
  return adminOrderStore.orders.filter(o => o.status === 'delivered').length
})

// Filtered orders
const filteredOrders = computed(() => {
  let orders = [...adminOrderStore.orders]
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    orders = orders.filter(o => 
      o.order_number.toLowerCase().includes(query) ||
      o.user?.name?.toLowerCase().includes(query) ||
      o.user?.email?.toLowerCase().includes(query)
    )
  }
  
  // Filter by status
  if (statusFilter.value) {
    orders = orders.filter(o => o.status === statusFilter.value)
  }
  
  // Filter by date
  if (dateFilter.value !== 'all') {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    
    if (dateFilter.value === 'today') {
      orders = orders.filter(o => new Date(o.created_at) >= startOfDay)
    } else if (dateFilter.value === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      orders = orders.filter(o => new Date(o.created_at) >= weekAgo)
    } else if (dateFilter.value === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      orders = orders.filter(o => new Date(o.created_at) >= monthAgo)
    }
  }
  
  return orders
})

onMounted(() => {
  loadData()
})

const loadData = () => {
  adminOrderStore.fetchAllOrders()
}

const refreshData = () => {
  loadData()
}

const viewOrderDetail = (order) => {
  selectedOrder.value = order
  statusEdit.value = order.status
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const updateStatus = async (orderId) => {
  if (statusEdit.value === selectedOrder.value.status) return
  
  const success = await adminOrderStore.updateOrderStatus(orderId, statusEdit.value)
  
  if (success) {
    alert('Status pesanan berhasil diupdate')
    selectedOrder.value.status = statusEdit.value
  } else {
    alert('Gagal update status')
  }
}

const formatPaymentMethod = (method) => {
  const map = {
    transfer: '💳 Transfer Bank',
    cod: '💵 Bayar di Tempat',
    ovo: '📱 OVO / Dana'
  }
  return map[method] || method
}

const formatShippingMethod = (method) => {
  const map = {
    jne: 'JNE Reguler',
    jnt: 'J&T Express',
    sicepat: 'SiCepat',
    grab: 'Grab Express'
  }
  return map[method] || method
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'
}
</script>

<style scoped>
.admin-orders {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total { background: #e3f2fd; color: #1976d2; }
.stat-icon.pending { background: #fff3e0; color: #e65100; }
.stat-icon.processed { background: #e8f5e9; color: #2e7d32; }
.stat-icon.delivered { background: #e8f5e9; color: #2e7d32; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Filters */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn-refresh {
  padding: 10px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
}

/* Table */
.table-responsive {
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  color: #555;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.order-row:hover {
  background: #f8f9fa;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 600;
  color: #333;
}

.customer-email {
  font-size: 0.85rem;
  color: #666;
}

.order-total {
  font-weight: bold;
  color: #667eea;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-pending {
  background: #fff3e0;
  color: #e65100;
}

.badge-processed {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-shipped {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-delivered {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-cancelled {
  background: #fee;
  color: #c00;
}

.btn-view {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content.large {
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.detail-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.detail-section h3 {
  color: #333;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-item .label {
  font-size: 0.85rem;
  color: #666;
}

.info-item .value {
  font-weight: 500;
  color: #333;
}

.status-control {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-select {
  flex: 1;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
}

.btn-update-status {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-update-status:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.items-list {
  margin-bottom: 1.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info h4 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: #333;
}

.item-info p {
  font-size: 0.9rem;
  color: #666;
}

.item-total {
  font-weight: bold;
  color: #667eea;
}

.order-totals {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #666;
}

.total-row.grand-total {
  font-weight: bold;
  color: #333;
  border-top: 2px solid #e0e0e0;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.notes {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  color: #666;
  line-height: 1.6;
}

/* Loading */
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

/* Error */
.error {
  text-align: center;
  padding: 3rem;
  background: #fee;
  border-radius: 12px;
  color: #c00;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Empty */
.empty {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item.full-width {
    grid-column: span 1;
  }
  
  .order-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .item-image {
    margin: 0 auto;
  }
}
</style>