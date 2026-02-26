<template>
  <div class="admin-view">
    <div class="admin-header">
      <h1>Admin Panel</h1>
      <p>Selamat datang, <strong>{{ authStore.user?.name }}</strong></p>
    </div>
    
    <div class="admin-stats" v-if="stats">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalProducts }}</span>
          <span class="stat-label">Total Produk</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <span class="stat-value"> {{ formatPrice(stats.totalValue) }}</span>
          <span class="stat-label">Total Nilai</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.lowStock }}</span>
          <span class="stat-label">Stok Menipis</span>
        </div>
      </div>
    </div>
    
    <!-- Hanya satu tab: Manajemen Produk -->
    <div class="admin-section">
      <div class="section-header">
        <h2>Manajemen Produk</h2>
        <div class="header-actions">
          <button @click="refreshData" class="btn-refresh" title="Refresh data">
            🔄 Refresh
          </button>
          <button @click="openAddModal" class="btn-add">
            + Tambah Produk Baru
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="productStore.loading" class="loading">
        <div class="spinner"></div>
        <p>Memuat produk...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="productStore.error" class="error">
        <p>{{ productStore.error }}</p>
        <button @click="loadProducts" class="btn-retry">Coba Lagi</button>
      </div>
      
      <!-- Products Table -->
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Gambar</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productStore.products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>
                <img 
                  :src="product.image" 
                  :alt="product.name" 
                  class="table-image"
                  @error="handleImageError"
                >
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.category?.name || product.category }}</td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>
                <span :class="['stock-badge', { 'low-stock': product.stock < 10 }]">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <button @click="openEditModal(product)" class="btn-edit">✏️ Edit</button>
                <button @click="confirmDelete(product)" class="btn-delete">🗑️ Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal Tambah/Edit Produk -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ modalMode === 'add' ? 'Tambah Produk Baru' : 'Edit Produk' }}</h2>
        
        <!-- Form untuk produk -->
<form @submit.prevent="saveProduct" class="product-form">
  <div class="form-group">
    <label>Nama Produk <span class="required">*</span></label>
    <input 
      v-model="productForm.name" 
      type="text" 
      required
      placeholder="Contoh: Laptop Gaming"
    >
  </div>
  
  <div class="form-group">
    <label>Deskripsi <span class="required">*</span></label>
    <textarea 
      v-model="productForm.description" 
      rows="3" 
      required
      placeholder="Deskripsi lengkap produk"
    ></textarea>
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label>Harga (Rp) <span class="required">*</span></label>
      <input 
        :value="priceDisplay" 
        type="text" 
        required
        placeholder="10.000"
        @input="updatePrice"
      >
    </div>
    <div class="form-group">
      <label>Stok <span class="required">*</span></label>
      <input 
        v-model.number="productForm.stock" 
        type="number" 
        min="0"
        required
        placeholder="50"
      >
    </div>
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label>Kategori <span class="required">*</span></label>
      <select 
        v-model="productForm.category_id" 
        required
      >
        <option value="">Pilih Kategori</option>
        <option 
          v-for="category in categoryStore.categories" 
          :key="category.id" 
          :value="category.id"
        >
          {{ category.icon }} {{ category.name }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label>Gambar</label>
      <input 
        type="file" 
        @change="handleImageUpload" 
        accept="image/*"
        :required="modalMode === 'add'"
      >
      <small v-if="modalMode === 'edit'" class="hint">
        Kosongkan jika tidak ingin mengubah gambar
      </small>
    </div>
  </div>
  
  <!-- Preview Gambar -->
  <div v-if="imagePreview" class="image-preview">
    <img :src="imagePreview" alt="Preview">
    <button type="button" @click="removeImage" class="btn-remove">✕</button>
  </div>
  
  <div class="modal-actions">
    <button type="submit" class="btn-save" :disabled="productStore.loading">
      {{ productStore.loading ? 'Menyimpan...' : 'Simpan' }}
    </button>
    <button type="button" @click="closeModal" class="btn-cancel">
      Batal
    </button>
  </div>
</form>
      </div>
    </div>
    
    <!-- Modal Konfirmasi Hapus -->
    <div v-if="showDeleteModal" class="modal" @click.self="closeDeleteModal">
      <div class="modal-content delete-modal">
        <h2>🗑️ Hapus Produk</h2>
        <p>Apakah Anda yakin ingin menghapus produk <strong>{{ selectedProduct?.name }}</strong>?</p>
        <p class="warning">Tindakan ini tidak dapat dibatalkan!</p>
        
        <div class="modal-actions">
          <button @click="deleteProduct" class="btn-delete-confirm" :disabled="productStore.loading">
            {{ productStore.loading ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
          <button @click="closeDeleteModal" class="btn-cancel">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated, onUnmounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { formatRupiahWithPrefix, formatRupiah, parseRupiah } from '@/utils/formatter'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const authStore = useAuthStore()
const toast = useToast()

// State
const activeTab = ref('products')
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('add')
const selectedProduct = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')
const refreshInterval = ref(null)

// Form untuk produk
const productForm = reactive({
  name: '',
  description: '',
  price: '',
  category_id: '',
  stock: '',
  image: null
})

// Statistik
const stats = computed(() => {
  const products = productStore.products
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const lowStock = products.filter(p => p.stock < 10).length
  return { totalProducts, totalValue, lowStock }
})

// Load data saat halaman dimuat
onMounted(() => {
  loadProducts()
  categoryStore.fetchCategories()
  
  // Set interval untuk refresh otomatis setiap 30 detik
  refreshInterval.value = setInterval(() => {
    console.log('Auto-refresh admin data...')
    loadProducts()
  }, 30000)
})

// Cleanup interval saat komponen di-unmount
onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

// Dipanggil setiap kali halaman diaktifkan
onActivated(() => {
  loadProducts()
})

const loadProducts = async () => {
  console.log('Loading products for admin...')
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories()
  ])
}

const refreshData = () => {
  loadProducts()
  toast.info('Data produk direfresh')
}

// Format harga
const formatPrice = (price) => {
  return formatRupiahWithPrefix(price)
}

// Handle error gambar
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'
}

// Modal Tambah
const openAddModal = () => {
  modalMode.value = 'add'
  resetForm()
  showModal.value = true
}

// Modal Edit
const openEditModal = (product) => {
  modalMode.value = 'edit'
  selectedProduct.value = product
  
  productForm.name = product.name || ''
  productForm.description = product.description || ''
  productForm.price = product.price || ''
  productForm.category_id = product.category?.id || product.category_id || ''  // Perbaiki ini
  productForm.stock = product.stock || ''
  imagePreview.value = product.image || ''
  
  console.log('Edit modal - category_id:', productForm.category_id)
  
  showModal.value = true
}

// Reset form
const resetForm = () => {
  productForm.name = ''
  productForm.description = ''
  productForm.price = ''
  productForm.category_id = ''
  productForm.stock = ''
  imageFile.value = null
  imagePreview.value = ''
  selectedProduct.value = null
}

// Handle upload gambar
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Ukuran file maksimal 2MB')
    return
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    toast.error('File harus JPG atau PNG')
    return
  }
  
  imageFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Hapus gambar
const removeImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

// Format harga display
const priceDisplay = computed({
  get: () => {
    return productForm.price ? formatRupiah(productForm.price) : ''
  },
  set: (value) => {
    // Kosongkan, dihandle oleh updatePrice
  }
})

const updatePrice = (event) => {
  const rawValue = event.target.value.replace(/[^0-9]/g, '')
  productForm.price = rawValue ? parseInt(rawValue) : ''
  console.log('Price updated:', productForm.price)
}

// Simpan produk
const saveProduct = async () => {
  console.log('=== DEBUG FORM ===')
  console.log('Name:', productForm.name)
  console.log('Description:', productForm.description)
  console.log('Price:', productForm.price)
  console.log('Category ID:', productForm.category_id)
  console.log('Stock:', productForm.stock)
  console.log('Image File:', imageFile.value)
  console.log('Modal Mode:', modalMode.value)
  
  // Validasi form
  if (!productForm.name || !productForm.description || !productForm.price || 
      !productForm.category_id || !productForm.stock) {
    toast.error('Semua field harus diisi!')
    return
  }
  
  // Untuk tambah produk, wajib ada gambar
  if (modalMode.value === 'add' && !imageFile.value) {
    toast.error('Pilih gambar produk!')
    return
  }
  
  // Pastikan category_id adalah number
  const categoryId = parseInt(productForm.category_id)
  if (isNaN(categoryId)) {
    toast.error('Kategori tidak valid!')
    return
  }
  
  const productData = {
    name: productForm.name,
    description: productForm.description,
    price: parseInt(productForm.price),
    category_id: categoryId,  // PASTIKAN INI 'category_id' BUKAN 'category'
    stock: parseInt(productForm.stock),
    image: imageFile.value
  }
  
  console.log('Product data to send:', productData)
  
  let success = false
  
  if (modalMode.value === 'add') {
    success = await productStore.createProduct(productData)
    if (success) {
      toast.success('Produk berhasil ditambahkan!')
      closeModal()
    } else {
      showValidationErrors()
    }
  } else {
    success = await productStore.updateProduct(selectedProduct.value.id, productData)
    if (success) {
      toast.success('Produk berhasil diupdate!')
      closeModal()
    } else {
      showValidationErrors()
    }
  }
}

// Tampilkan pesan error validasi dari backend
const showValidationErrors = () => {
  const errors = productStore.error
  console.error('Validation errors:', JSON.stringify(errors))
  
  if (typeof errors === 'object' && errors !== null) {
    // Laravel validation errors: { field: ["message1", "message2"] }
    const messages = Object.values(errors).flat()
    messages.forEach(msg => toast.error(msg))
  } else if (typeof errors === 'string') {
    toast.error(errors)
  } else {
    toast.error('Gagal menyimpan produk')
  }
}

// Konfirmasi hapus
const confirmDelete = (product) => {
  selectedProduct.value = product
  showDeleteModal.value = true
}

// Hapus produk
const deleteProduct = async () => {
  if (!selectedProduct.value) return
  
  const success = await productStore.deleteProduct(selectedProduct.value.id)
  
  if (success) {
    toast.success('Produk berhasil dihapus!')
    closeDeleteModal()
  }
}

// Tutup modal
const closeModal = () => {
  showModal.value = false
  resetForm()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedProduct.value = null
}
</script>

<style scoped>
/* Tambahkan style untuk tombol refresh */
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-refresh {
  padding: 0.8rem 1.2rem;
  background: #4e598b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.btn-refresh:hover {
  background: #4e598b;
  transform: translateY(-2px);
}

.admin-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.admin-header p {
  color: #666;
  font-size: 1rem;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  background: #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4e598b;
  line-height: 1.2;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
}

.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 1rem;
}

.admin-tabs button {
  padding: 0.8rem 1.5rem;
  border: none;
  background: white;
  color: #666;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.admin-tabs button.active {
  background: #4e598b;
  color: white;
}

.admin-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #333;
}

.btn-add {
  padding: 0.8rem 1.5rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.table-responsive {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  color: #555;
  font-weight: 600;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.stock-badge {
  padding: 4px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  font-weight: 600;
}

.stock-badge.low-stock {
  background: #fff3e0;
  color: #e65100;
}

.btn-edit {
  padding: 6px 12px;
  background: #4e598b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-delete {
  padding: 6px 12px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit:hover {
  background: #4e598b;
}

.btn-delete:hover {
  background: #ff3838;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #ffffff;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #c00;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.coming-soon {
  text-align: center;
  padding: 4rem;
  color: #999;
  font-size: 1.2rem;
}

/* Modal Styles */
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
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.delete-modal {
  max-width: 400px;
  text-align: center;
}

.delete-modal h2 {
  color: #ff4757;
  margin-bottom: 1rem;
}

.delete-modal p {
  margin: 0.5rem 0;
  color: #555;
}

.delete-modal .warning {
  color: #ff4757;
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group .required {
  color: #c00;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
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

.hint {
  display: block;
  margin-top: 0.3rem;
  color: #888;
  font-size: 0.8rem;
}

.image-preview {
  position: relative;
  margin-top: 1rem;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid #667eea;
}

.btn-remove {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #c00;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-save {
  flex: 2;
  padding: 0.8rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover:not(:disabled) {
  background: #5a6fd6;
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

.btn-delete-confirm {
  flex: 2;
  padding: 0.8rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-delete-confirm:hover:not(:disabled) {
  background: #ff3838;
}

@media (max-width: 768px) {
  .admin-stats {
    grid-template-columns: 1fr;
  }
  
  .admin-tabs {
    flex-direction: column;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>