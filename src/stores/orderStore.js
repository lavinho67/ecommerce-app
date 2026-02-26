import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderService } from '@/services/orderService'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load orders dari API
  async function loadOrders() {
    loading.value = true
    error.value = null
    
    try {
      const response = await orderService.getMyOrders()
      if (response.success) {
        orders.value = response.data
      }
    } catch (err) {
      error.value = 'Gagal memuat pesanan'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Checkout - buat pesanan baru
  async function checkout(orderData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await orderService.checkout(orderData)
      
      if (response.success) {
        // Tambahkan order baru ke daftar
        orders.value.unshift(response.data.order)
        return { success: true, data: response.data }
      }
      return { success: false, error: response.message }
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err)
      error.value = err.response?.data?.message || 'Gagal memproses pesanan'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    loading,
    error,
    loadOrders,
    checkout
  }
})