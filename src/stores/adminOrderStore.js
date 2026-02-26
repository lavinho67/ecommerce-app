import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAdminOrderStore = defineStore('adminOrder', () => {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedOrder = ref(null)

  // Ambil semua orders
  async function fetchAllOrders() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/admin/orders')
      if (response.data.success) {
        orders.value = response.data.data
      }
    } catch (err) {
      error.value = 'Gagal memuat pesanan'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Ambil detail order
  async function fetchOrderDetail(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/admin/orders/${id}`)
      if (response.data.success) {
        selectedOrder.value = response.data.data
      }
    } catch (err) {
      error.value = 'Gagal memuat detail pesanan'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Update status order
  async function updateOrderStatus(id, status) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/admin/orders/${id}/status`, { status })
      
      if (response.data.success) {
        // Update di list orders
        const index = orders.value.findIndex(o => o.id === id)
        if (index !== -1) {
          orders.value[index].status = status
        }
        // Update di selected order jika ada
        if (selectedOrder.value && selectedOrder.value.id === id) {
          selectedOrder.value.status = status
        }
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal update status'
      return false
    } finally {
      loading.value = false
    }
  }

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return '-'
    }
  }

  // Format status
  const getStatusBadgeClass = (status) => {
    const map = {
      pending: 'badge-pending',
      processed: 'badge-processed',
      shipped: 'badge-shipped',
      delivered: 'badge-delivered',
      cancelled: 'badge-cancelled'
    }
    return map[status] || 'badge-pending'
  }

  const getStatusText = (status) => {
    const map = {
      pending: '⏳ Menunggu',
      processed: '📦 Diproses',
      shipped: '🚚 Dikirim',
      delivered: '✅ Diterima',
      cancelled: '❌ Dibatalkan'
    }
    return map[status] || status
  }

  return {
    orders,
    loading,
    error,
    selectedOrder,
    fetchAllOrders,
    fetchOrderDetail,
    updateOrderStatus,
    formatDate,
    getStatusBadgeClass,
    getStatusText
  }
})