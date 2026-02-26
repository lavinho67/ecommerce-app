import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/login', { email, password })
      
      if (response.data.success) {
        user.value = response.data.user
        token.value = response.data.token
        
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        
        return true
      }
      return false
    } catch (err) {
      error.value = err.response?.data?.message || 'Login gagal'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password, passwordConfirmation) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
      
      console.log('Register response:', response.data) // Untuk debugging
      
      // CEK RESPONSE DARI SERVER
      if (response.data && response.data.success === true) {
        // Registrasi berhasil
        user.value = response.data.user
        token.value = response.data.token
        
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        
        return true
      } else {
        // Registrasi gagal (tapi mungkin data tetap masuk?)
        error.value = response.data.message || 'Registrasi gagal'
        return false
      }
    } catch (err) {
      console.error('Register error:', err.response?.data || err)
      
      // Tangani error dari server
      if (err.response?.data?.errors) {
        error.value = err.response.data.errors
      } else if (err.response?.data?.message) {
        error.value = { general: [err.response.data.message] }
      } else {
        error.value = { general: ['Registrasi gagal. Silakan coba lagi.'] }
      }
      
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await api.post('/logout')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Redirect ke login page
      window.location.href = '/login'
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    try {
      const response = await api.get('/user')
      if (response.data.success) {
        user.value = response.data.user
      }
    } catch (err) {
      console.error('Fetch user error:', err)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser
  }
})