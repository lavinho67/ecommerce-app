import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileService } from '@/services/profileService'
import { useAuthStore } from './authStore'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    province: ''
  })
  const loading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()

  // Load profile dari API
  async function loadProfile() {
    loading.value = true
    error.value = null
    
    try {
      const response = await profileService.getProfile()
      if (response.success) {
        profile.value = response.data
        
        // Update juga di authStore jika perlu
        if (authStore.user) {
          authStore.user = { ...authStore.user, ...response.data }
        }
      }
    } catch (err) {
      error.value = 'Gagal memuat profile'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Update profile
  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await profileService.updateProfile(profileData)
      
      if (response.success) {
        profile.value = response.data
        
        // Update di authStore
        if (authStore.user) {
          authStore.user = { ...authStore.user, ...response.data }
        }
        
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.errors || 'Gagal update profile'
      return false
    } finally {
      loading.value = false
    }
  }

  // Update alamat
  async function updateAddress(addressData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await profileService.updateAddress(addressData)
      
      if (response.success) {
        profile.value.address = response.data.address
        profile.value.city = response.data.city
        profile.value.postal_code = response.data.postal_code
        profile.value.province = response.data.province
        
        // Update di authStore
        if (authStore.user) {
          authStore.user.address = response.data.address
          authStore.user.city = response.data.city
          authStore.user.postal_code = response.data.postal_code
          authStore.user.province = response.data.province
        }
        
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.errors || 'Gagal update alamat'
      return false
    } finally {
      loading.value = false
    }
  }

  // Ubah password
  async function changePassword(passwordData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await profileService.changePassword(passwordData)
      return response.success
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengubah password'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    updateAddress,
    changePassword
  }
})