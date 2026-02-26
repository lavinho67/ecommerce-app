<template>
  <div class="auth-view">
    <div class="auth-card">
      <h1>Selamat Datang Kembali</h1>
      <p>Silakan login untuk melanjutkan belanja</p>
      
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="nama@email.com"
          >
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
          >
        </div>
        
        <div class="auth-options">
          <label>
            <input type="checkbox"> Ingat saya
          </label>
          <a href="#">Lupa password?</a>
        </div>
        
        <button type="submit" class="btn-auth" :disabled="authStore.loading">
          {{ authStore.loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      
      <p class="auth-footer">
        Belum punya akun? 
        <router-link to="/register">Daftar sekarang</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  
  if (success) {
    toast.success(`Selamat datang kembali, ${authStore.user.name}!`)
    
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } else {
    toast.error(authStore.error)
  }
}
</script>

<style scoped>
.auth-view {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #667eea;
}

.auth-options {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 2rem;
}

.auth-options a {
  color: #667eea;
  text-decoration: none;
}

.btn-auth {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-auth:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 0;
}

.auth-footer a {
  color: #667eea;
  font-weight: bold;
  text-decoration: none;
}
</style>