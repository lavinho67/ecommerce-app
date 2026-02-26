<template>
  <div class="checkout-view">
    <h1>Checkout</h1>
    
    <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
      <p>Keranjang belanja Anda kosong</p>
      <router-link to="/products" class="btn-primary">Belanja Sekarang</router-link>
    </div>
    
    <div v-else class="checkout-container">
      <!-- Form Pengiriman -->
      <div class="checkout-form">
        <h2>Informasi Pengiriman</h2>
        
        <div class="profile-fill-section">
          <button @click="fillFromProfile" class="btn-fill-profile">
            📋 Isi dari Profile Tersimpan
          </button>
        </div>
        
        <!-- Informasi User -->
        <div class="user-info-card">
          <h3>👤 Data Pemesan</h3>
          <div class="user-info-row">
            <span class="info-label">Nama:</span>
            <span class="info-value">{{ authStore.user?.name }}</span>
          </div>
          <div class="user-info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ authStore.user?.email }}</span>
          </div>
          <div class="user-info-row">
            <span class="info-label">No. HP:</span>
            <span class="info-value">{{ form.telepon || '-' }}</span>
          </div>
        </div>
        
        <form @submit.prevent="submitOrder" class="form">
          <!-- Nomor Telepon -->
          <div class="form-group">
            <label>Nomor Telepon <span class="required">*</span></label>
            <input 
              type="tel" 
              v-model="form.telepon" 
              required
              placeholder="081234567890"
            >
            <small class="hint" v-if="profileData.phone">Tersimpan dari profile: {{ profileData.phone }}</small>
          </div>
          
          <!-- Alamat Lengkap -->
          <div class="form-group">
            <label>Alamat Lengkap <span class="required">*</span></label>
            <textarea 
              v-model="form.alamat" 
              rows="3" 
              required
              placeholder="Masukkan alamat lengkap"
            ></textarea>
            <small class="hint" v-if="profileData.address">Tersimpan dari profile: {{ profileData.address }}</small>
          </div>
          
          <!-- Row untuk Kota dan Provinsi -->
          <div class="form-row">
            <div class="form-group">
              <label>Kota/Kabupaten <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.kota" 
                required
                placeholder="Jakarta"
              >
              <small class="hint" v-if="profileData.city">Tersimpan: {{ profileData.city }}</small>
            </div>

            <div class="form-group">
              <label>Provinsi <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.provinsi" 
                required
                placeholder="DKI Jakarta"
              >
              <small class="hint" v-if="profileData.province">Tersimpan: {{ profileData.province }}</small>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Kode Pos <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.kodepos" 
                required
                placeholder="12345"
              >
              <small class="hint" v-if="profileData.postalCode">Tersimpan: {{ profileData.postalCode }}</small>
            </div>
            
            <div class="form-group">
              <!-- Empty spacer for layout consistency -->
            </div>
          </div>
          
          <!-- Metode Pengiriman -->
          <div class="form-group">
            <label>Metode Pengiriman <span class="required">*</span></label>
            <select v-model="form.pengiriman" required>
              <option value="">Pilih metode pengiriman</option>
              <option value="jne">JNE (2-3 hari) - Rp 15.000</option>
              <option value="jnt">J&T (2-3 hari) - Rp 15.000</option>
              <option value="sicepat">SiCepat (1-2 hari) - Rp 25.000</option>
              <option value="grab">Grab Express (Instant) - Rp 35.000</option>
            </select>
          </div>
          
          <!-- Metode Pembayaran -->
          <div class="form-group">
            <label>Metode Pembayaran <span class="required">*</span></label>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" v-model="form.pembayaran" value="transfer" required>
                <span>💳 Transfer Bank</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="form.pembayaran" value="cod">
                <span>💵 Bayar di Tempat (COD)</span>
              </label>
              <label class="payment-option">
                <input type="radio" v-model="form.pembayaran" value="ovo">
                <span>📱 OVO / Dana</span>
              </label>
            </div>
          </div>
          
          <!-- Catatan -->
          <div class="form-group">
            <label>Catatan (opsional)</label>
            <textarea 
              v-model="form.catatan" 
              rows="2" 
              placeholder="Catatan untuk penjual"
            ></textarea>
          </div>
        </form>
      </div>
      
      <!-- Ringkasan Pesanan -->
      <div class="order-summary">
        <h2>Ringkasan Pesanan</h2>
        
        <div class="summary-items">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="summary-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p>{{ item.quantity }} x {{ formatRupiahWithPrefix(item.price) }}</p>
            </div>
            <div class="item-total">
              {{ formatRupiahWithPrefix(item.price * item.quantity) }}
            </div>
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatRupiahWithPrefix(cartStore.totalPrice) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Ongkos Kirim</span>
            <span>{{ shippingCostFormatted }}</span>
          </div>
          
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ formatRupiahWithPrefix(totalWithShipping) }}</span>
          </div>
        </div>
        
        <button 
          @click="submitOrder" 
          class="btn-order"
          :disabled="!isFormValid || submitting"
        >
          {{ submitting ? 'Memproses...' : 'Buat Pesanan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { formatRupiahWithPrefix } from '@/utils/formatter'
import { useProfileStore } from '@/stores/profileStore'

const profileStore = useProfileStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const toast = useToast()
const router = useRouter()

const submitting = ref(false)

// Data profile dari store
const profileData = computed(() => ({
  phone: profileStore.profile.phone || '',
  address: profileStore.profile.address || '',
  city: profileStore.profile.city || '',
  postalCode: profileStore.profile.postal_code || '',
  province: profileStore.profile.province || ''
}))

// Form state
const form = reactive({
  telepon: '',
  alamat: '',
  kota: '',
  kodepos: '',
  provinsi: '',
  pengiriman: '',
  pembayaran: '',
  catatan: ''
})

onMounted(async () => {
  // Load profile dari database
  await profileStore.loadProfile()
  
  // Isi form dengan data profile
  form.telepon = profileStore.profile.phone || ''
  form.alamat = profileStore.profile.address || ''
  form.kota = profileStore.profile.city || ''
  form.kodepos = profileStore.profile.postal_code || ''
  form.provinsi = profileStore.profile.province || ''
})

const shippingCosts = {
  jne: 15000,
  jnt: 15000,
  sicepat: 25000,
  grab: 35000
}

const shippingCost = computed(() => shippingCosts[form.pengiriman] || 0)

const shippingCostFormatted = computed(() => {
  return shippingCost.value > 0 
    ? formatRupiahWithPrefix(shippingCost.value)
    : 'Pilih metode pengiriman'
})

const totalWithShipping = computed(() => {
  return cartStore.totalPrice + shippingCost.value
})

const isFormValid = computed(() => {
  return form.telepon && form.alamat && form.kota && form.provinsi && form.kodepos && 
         form.pengiriman && form.pembayaran
})

// Tombol untuk mengisi dari profile
const fillFromProfile = () => {
  form.telepon = profileStore.profile.phone || form.telepon
  form.alamat = profileStore.profile.address || form.alamat
  form.kota = profileStore.profile.city || form.kota
  form.provinsi = profileStore.profile.province || form.provinsi
  form.kodepos = profileStore.profile.postal_code || form.kodepos
  toast.info('Form diisi dari data profile')
}

const submitOrder = async () => {
  if (!isFormValid.value) {
    toast.error('Harap isi semua field yang diperlukan')
    return
  }
  
  submitting.value = true
  
  // Siapkan data untuk API
  const items = cartStore.cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity
  }))
  
  const orderData = {
    items: items,
    shipping_address: `${form.alamat}, ${form.kota}, ${form.provinsi}, ${form.kodepos}`,
    payment_method: form.pembayaran,
    shipping_method: form.pengiriman,
    shipping_cost: shippingCost.value,
    notes: form.catatan
  }
  
  console.log('Sending order data:', orderData)
  
  const result = await orderStore.checkout(orderData)
  
  if (result.success) {
    toast.success('Pesanan berhasil dibuat!')
    cartStore.clearCart()
    router.push('/orders')
  } else {
    toast.error(result.error || 'Gagal membuat pesanan')
  }
  
  submitting.value = false
}
</script>

<style scoped>
.user-info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}

.user-info-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.user-info-row {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #e0e0e0;
}

.user-info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 80px;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.checkout-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.empty-cart p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}

.checkout-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Form Styles */
.checkout-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.checkout-form h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.payment-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Order Summary */
.order-summary {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.order-summary h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;
}

.summary-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.item-details p {
  font-size: 0.85rem;
  color: #666;
}

.item-total {
  font-weight: bold;
  color: #667eea;
}

.summary-totals {
  border-top: 2px solid #e0e0e0;
  padding-top: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-row.discount {
  color: #48bb78;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e0e0e0;
}

.voucher-section {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.voucher-section input {
  flex: 1;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
}

.btn-apply {
  padding: 10px 20px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-apply:hover {
  background: #38a169;
}

.btn-order {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.btn-order:hover:not(:disabled) {
  background: #5a6fd6;
  transform: translateY(-2px);
}

.btn-order:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.terms {
  font-size: 0.85rem;
  color: #888;
  text-align: center;
}

.terms a {
  color: #667eea;
  text-decoration: none;
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

.modal-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  color: #48bb78;
  margin-bottom: 1rem;
}

.modal-content p {
  margin: 0.5rem 0;
  color: #666;
}

.modal-content strong {
  color: #333;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-home {
  flex: 1;
  padding: 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}

.btn-print {
  flex: 1;
  padding: 1rem;
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
.hint {
  display: block;
  margin-top: 4px;
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
}

.profile-fill-section {
  margin-bottom: 1rem;
  text-align: right;
}

.btn-fill-profile {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-fill-profile:hover {
  background: #5a6fd6;
  transform: translateY(-2px);
}
</style>