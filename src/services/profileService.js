import api from './api'

export const profileService = {
  // Ambil data profile
  async getProfile() {
    try {
      const response = await api.get('/profile')
      return response.data
    } catch (error) {
      console.error('Get profile error:', error.response?.data || error)
      throw error
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/profile', profileData)
      return response.data
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error)
      throw error
    }
  },

  // Update alamat
  async updateAddress(addressData) {
    try {
      const response = await api.put('/profile/address', addressData)
      return response.data
    } catch (error) {
      console.error('Update address error:', error.response?.data || error)
      throw error
    }
  },

  // Ubah password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/profile/password', passwordData)
      return response.data
    } catch (error) {
      console.error('Change password error:', error.response?.data || error)
      throw error
    }
  }
}