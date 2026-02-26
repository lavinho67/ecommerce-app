import api from './api'

export const orderService = {
  // Checkout - buat pesanan baru
  async checkout(orderData) {
    try {
      const response = await api.post('/checkout', orderData)
      return response.data
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error)
      throw error
    }
  },

  // Ambil orders user
  async getMyOrders() {
    try {
      const response = await api.get('/orders')
      return response.data
    } catch (error) {
      console.error('Get orders error:', error.response?.data || error)
      throw error
    }
  },

  // Ambil detail order
  async getOrderDetail(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Get order detail error:', error.response?.data || error)
      throw error
    }
  }
}