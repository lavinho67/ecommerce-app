<template>
  <div class="profile-view">
    <h1>Profil Saya</h1>
    
    <div class="profile-container">
      <!-- Sidebar -->
      <div class="profile-sidebar">
        <div class="profile-avatar">
          <div class="avatar-circle">👤</div>
          <h3>{{ profileStore.profile.name || 'User' }}</h3>
          <p>{{ profileStore.profile.email || '' }}</p>
        </div>
        
        <div class="profile-menu">
          <button 
            @click="activeTab = 'profile'"
            :class="{ active: activeTab === 'profile' }"
          >
            📋 Data Diri
          </button>
          <button 
            v-if="!authStore.isAdmin"
            @click="activeTab = 'address'"
            :class="{ active: activeTab === 'address' }"
          >
            📍 Alamat
          </button>
          <button 
            @click="activeTab = 'security'"
            :class="{ active: activeTab === 'security' }"
          >
            🔒 Keamanan
          </button>
          <router-link v-if="!authStore.isAdmin" to="/orders" class="profile-menu-link">
            📦 Riwayat Pesanan
          </router-link>
        </div>
      </div>
      
      <!-- Content -->
      <div class="profile-content">
        <!-- Loading State -->
        <div v-if="profileStore.loading" class="loading">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="profileStore.error" class="error">
          <p>{{ profileStore.error }}</p>
          <button @click="loadProfile" class="btn-retry">Coba Lagi</button>
        </div>
        
        <!-- Tab Data Diri -->
        <div v-else-if="activeTab === 'profile'" class="tab-content">
          <h2>Data Diri</h2>
          
          <div v-if="editMode === 'profile'" class="edit-form">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                v-model="editForm.name"
                placeholder="Nama lengkap"
              >
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                v-model="editForm.email"
                disabled
              >
              <small class="hint">Email tidak dapat diubah</small>
            </div>
            
            <div class="form-group">
              <label>Nomor Telepon</label>
              <input 
                type="tel" 
                v-model="editForm.phone"
                placeholder="Nomor telepon"
              >
            </div>
            
            <div class="form-actions">
              <button @click="saveProfile" class="btn-save" :disabled="saving">
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button @click="cancelEdit" class="btn-cancel">Batal</button>
            </div>
          </div>
          
          <div v-else class="profile-info">
            <div class="info-row">
              <span class="info-label">Nama Lengkap</span>
              <span class="info-value">{{ profileStore.profile.name || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ profileStore.profile.email || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nomor Telepon</span>
              <span class="info-value">{{ profileStore.profile.phone || '-' }}</span>
            </div>
            
            <button @click="startEdit('profile')" class="btn-edit-profile">
              ✏️ Edit Profil
            </button>
          </div>
        </div>
        
        <!-- Tab Alamat -->
        <div v-else-if="activeTab === 'address' && !authStore.isAdmin" class="tab-content">
          <h2>Alamat Saya</h2>
          
          <div v-if="editMode === 'address'" class="edit-form">
            <div class="form-group">
              <label>Alamat Lengkap</label>
              <textarea 
                v-model="editForm.address"
                rows="3"
                placeholder="Jalan, gang, nomor rumah"
              ></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Kota/Kabupaten</label>
                <input 
                  type="text" 
                  v-model="editForm.city"
                  placeholder="Kota"
                >
              </div>
              <div class="form-group">
                <label>Kode Pos</label>
                <input 
                  type="text" 
                  v-model="editForm.postalCode"
                  placeholder="Kode pos"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>Provinsi</label>
              <input 
                type="text" 
                v-model="editForm.province"
                placeholder="Provinsi"
              >
            </div>
            
            <div class="form-actions">
              <button @click="saveAddress" class="btn-save" :disabled="saving">
                {{ saving ? 'Menyimpan...' : 'Simpan Alamat' }}
              </button>
              <button @click="cancelEdit" class="btn-cancel">Batal</button>
            </div>
          </div>
          
          <div v-else class="profile-info">
            <div class="info-row">
              <span class="info-label">Alamat</span>
              <span class="info-value">{{ profileStore.profile.address || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Kota</span>
              <span class="info-value">{{ profileStore.profile.city || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Kode Pos</span>
              <span class="info-value">{{ profileStore.profile.postal_code || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Provinsi</span>
              <span class="info-value">{{ profileStore.profile.province || '-' }}</span>
            </div>
            
            <button @click="startEdit('address')" class="btn-edit-profile">
              ✏️ Edit Alamat
            </button>
          </div>
        </div>
        
        <!-- Tab Keamanan -->
        <div v-else-if="activeTab === 'security'" class="tab-content">
          <h2>Keamanan Akun</h2>
          
          <div v-if="editMode === 'security'" class="edit-form">
            <div class="form-group">
              <label>Password Lama <span class="required">*</span></label>
              <input 
                type="password" 
                v-model="editForm.oldPassword"
                placeholder="Masukkan password lama"
              >
            </div>
            
            <div class="form-group">
              <label>Password Baru <span class="required">*</span></label>
              <input 
                type="password" 
                v-model="editForm.newPassword"
                placeholder="Minimal 8 karakter"
              >
              <small class="hint">Gunakan kombinasi huruf dan angka untuk keamanan</small>
            </div>
            
            <div class="form-group">
              <label>Konfirmasi Password Baru <span class="required">*</span></label>
              <input 
                type="password" 
                v-model="editForm.confirmPassword"
                placeholder="Ulangi password baru"
              >
            </div>
            
            <div class="form-actions">
              <button @click="changePassword" class="btn-save" :disabled="saving">
                {{ saving ? 'Memproses...' : 'Ubah Password' }}
              </button>
              <button @click="cancelEdit" class="btn-cancel">Batal</button>
            </div>
          </div>
          
          <div v-else class="security-info">
            <div class="info-card">
              <div class="info-icon">🔐</div>
              <div class="info-content">
                <h3>Password</h3>
                <p>Password Anda tersimpan dengan aman</p>
                <div class="password-dots">••••••••</div>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">📅</div>
              <div class="info-content">
                <h3>Terakhir Login</h3>
                <p>{{ formatDate(profileStore.profile.last_login) || 'Belum pernah login' }}</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">🛡️</div>
              <div class="info-content">
                <h3>Status Akun</h3>
                <p><span class="badge-active">Aktif</span></p>
              </div>
            </div>
            
            <button @click="startEdit('security')" class="btn-edit-profile">
              🔒 Ubah Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const toast = useToast()

const activeTab = ref('profile')
const editMode = ref(null)
const saving = ref(false)

// Form untuk edit
const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  province: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Load data saat halaman dimuat
onMounted(async () => {
  await profileStore.loadProfile()
  
  // Set editForm dengan data profile
  editForm.name = profileStore.profile.name || ''
  editForm.email = profileStore.profile.email || ''
  editForm.phone = profileStore.profile.phone || ''
  editForm.address = profileStore.profile.address || ''
  editForm.city = profileStore.profile.city || ''
  editForm.postalCode = profileStore.profile.postal_code || ''
  editForm.province = profileStore.profile.province || ''
})

const loadProfile = () => {
  profileStore.loadProfile()
}

const startEdit = (tab) => {
  editMode.value = tab
  // Reset form dengan data terbaru
  editForm.name = profileStore.profile.name || ''
  editForm.phone = profileStore.profile.phone || ''
  editForm.address = profileStore.profile.address || ''
  editForm.city = profileStore.profile.city || ''
  editForm.postalCode = profileStore.profile.postal_code || ''
  editForm.province = profileStore.profile.province || ''
}

const cancelEdit = () => {
  editMode.value = null
}

const saveProfile = async () => {
  saving.value = true
  
  const success = await profileStore.updateProfile({
    name: editForm.name,
    phone: editForm.phone
  })
  
  if (success) {
    toast.success('Profil berhasil diperbarui!')
    editMode.value = null
  } else {
    toast.error('Gagal memperbarui profil')
  }
  
  saving.value = false
}

const saveAddress = async () => {
  saving.value = true
  
  const success = await profileStore.updateAddress({
    address: editForm.address,
    city: editForm.city,
    postal_code: editForm.postalCode,
    province: editForm.province
  })
  
  if (success) {
    toast.success('Alamat berhasil diperbarui!')
    editMode.value = null
  } else {
    toast.error('Gagal memperbarui alamat')
  }
  
  saving.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const changePassword = async () => {
  if (!editForm.oldPassword || !editForm.newPassword || !editForm.confirmPassword) {
    toast.error('Semua field harus diisi!')
    return
  }
  
  if (editForm.newPassword.length < 8) {
    toast.error('Password baru minimal 8 karakter!')
    return
  }
  
  if (editForm.newPassword !== editForm.confirmPassword) {
    toast.error('Konfirmasi password tidak cocok!')
    return
  }
  
  saving.value = true
  
  const success = await profileStore.changePassword({
    old_password: editForm.oldPassword,
    new_password: editForm.newPassword,
    new_password_confirmation: editForm.confirmPassword
  })
  
  if (success) {
    toast.success('Password berhasil diubah!')
    editMode.value = null
    editForm.oldPassword = ''
    editForm.newPassword = ''
    editForm.confirmPassword = ''
  } else {
    toast.error(profileStore.error || 'Gagal mengubah password')
  }
  
  saving.value = false
}
</script>

<!-- style scoped tetap sama -->

<style scoped>
.profile-view {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 20px;
}

.profile-view h1 {
  margin-bottom: 2rem;
  color: #333;
}

.profile-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

/* Sidebar */
.profile-sidebar {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  height: fit-content;
}

.profile-avatar {
  background: linear-gradient(135deg, #1a1a1a 0%, #cccccc 100%);
  color: white;
  padding: 2rem 1.5rem;
  text-align: center;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.profile-avatar h3 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.profile-avatar p {
  font-size: 0.9rem;
  opacity: 0.9;
}

.profile-menu {
  padding: 1rem;
}

.profile-menu button,
.profile-menu-link {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  color: #555;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  margin-bottom: 0.3rem;
}

.profile-menu button:hover,
.profile-menu-link:hover {
  background: #f0f0f0;
}

.profile-menu button.active {
  background: #667eea;
  color: white;
}

/* Content */
.profile-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tab-content h2 {
  margin-bottom: 2rem;
  color: #333;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.info-row {
  display: flex;
  padding: 0.8rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-label {
  width: 150px;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: #333;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.btn-edit-profile {
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s;
}

.btn-edit-profile:hover {
  background: #5a6fd6;
  transform: translateY(-2px);
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save {
  flex: 2;
  padding: 0.8rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: #38a169;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  flex: 1;
  padding: 0.8rem;
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
  
  .info-row {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .info-label {
    width: auto;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #e53e3e;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-retry:hover {
  background: #5a6fd6;
}

.hint {
  display: block;
  margin-top: 4px;
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
}

/* Security Tab Styles */
.info-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
}

.info-icon {
  font-size: 2rem;
  background: white;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.info-content h3 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
  color: #333;
}

.info-content p {
  font-size: 0.9rem;
  color: #666;
}

.password-dots {
  font-size: 1.2rem;
  letter-spacing: 2px;
  color: #667eea;
  font-weight: bold;
  margin-top: 0.3rem;
}

.badge-active {
  background: #c6f6d5;
  color: #2f855a;
  padding: 0.2rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.required {
  color: #e53e3e;
}
</style>