<template>
  <div class="auth-view">
    <div class="auth-card">
      <h1>Daftar Akun</h1>
      <p>Lengkapi data di bawah untuk membuat akun baru</p>
      
      <!-- Tampilkan error jika ada -->
      <div v-if="hasError" class="error-message">
        <div v-if="authStore.error?.general">
          <p>{{ authStore.error.general[0] }}</p>
        </div>
        <div v-else-if="authStore.error">
          <div v-for="(messages, field) in authStore.error" :key="field">
            <strong>{{ field }}:</strong>
            <ul>
              <li v-for="msg in messages" :key="msg">{{ msg }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Tampilkan success sementara (untuk debugging) -->
      <div v-if="registerSuccess" class="success-message">
        ✅ Registrasi berhasil! Mengalihkan...
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group" :class="{ 'has-error': hasFieldError('name') }">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            v-model="name" 
            required 
            placeholder="Nama lengkap Anda"
          >
        </div>
        
        <div class="form-group" :class="{ 'has-error': hasFieldError('email') }">
          <label>Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="nama@email.com"
          >
        </div>
        
        <div class="form-group" :class="{ 'has-error': hasFieldError('password') }">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="Min. 8 karakter"
          >
        </div>
        
        <div class="form-group">
          <label>Konfirmasi Password</label>
          <input 
            type="password" 
            v-model="confirmPassword" 
            required 
            placeholder="Ulangi password"
          >
        </div>
        
        <button type="submit" class="btn-auth" :disabled="authStore.loading">
          {{ authStore.loading ? 'Loading...' : 'Daftar' }}
        </button>
      </form>
      
      <p class="auth-footer">
        Sudah punya akun? 
        <router-link to="/login">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const registerSuccess = ref(false)

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Cek apakah ada error
const hasError = computed(() => {
  return authStore.error && Object.keys(authStore.error).length > 0
})

// Cek error untuk field tertentu
const hasFieldError = (field) => {
  return authStore.error && authStore.error[field]
}

const handleRegister = async () => {
  // Validasi frontend
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    toast.error('Semua field harus diisi!')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    toast.error('Password tidak cocok!')
    return
  }
  
  if (password.value.length < 8) {
    toast.error('Password minimal 8 karakter!')
    return
  }
  
  console.log('Mencoba register dengan:', { name: name.value, email: email.value })
  
  const success = await authStore.register(
    name.value, 
    email.value, 
    password.value, 
    confirmPassword.value
  )
  
  console.log('Hasil register:', success ? 'Berhasil' : 'Gagal')
  console.log('User data:', authStore.user)
  console.log('Token:', authStore.token)
  
  if (success) {
    // Tampilkan pesan sukses
    registerSuccess.value = true
    toast.success(`Selamat bergabung, ${authStore.user?.name || name.value}!`)
    
    // Redirect ke halaman utama setelah 1 detik
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } else {
    // Error sudah otomatis ditampilkan dari store
    console.log('Error:', authStore.error)
  }
}
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  text-align: center;
}

p {
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  border-left: 4px solid #c00;
}

.error-message ul {
  margin: 0.5rem 0 0 1.5rem;
  padding: 0;
}

.error-message li {
  margin: 0.2rem 0;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  border-left: 4px solid #2e7d32;
  text-align: center;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.has-error input {
  border-color: #c00;
  background: #fff0f0;
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
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group.has-error input:focus {
  border-color: #c00;
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
  transition: all 0.3s;
  margin-top: 1rem;
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

.auth-footer a:hover {
  text-decoration: underline;
}
</style>