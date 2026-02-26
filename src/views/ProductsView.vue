<template>
  <div class="products-view">
    <!-- Header -->
    <div class="products-header">
      <h1>Semua Produk</h1>
      <p>Temukan produk terbaik untuk kebutuhan Anda</p>
    </div>
    
    <!-- Filter & Search -->
    <div class="products-toolbar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari produk..."
          class="search-input"
        >
      </div>
      
      <div class="filter-box">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Semua Kategori</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        
        <select v-model="sortBy" class="filter-select">
          <option value="default">Urutkan</option>
          <option value="price-asc">Harga Terendah</option>
          <option value="price-desc">Harga Tertinggi</option>
          <option value="name-asc">Nama A-Z</option>
          <option value="name-desc">Nama Z-A</option>
        </select>
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
      <button @click="retry" class="btn-retry">Coba Lagi</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="empty">
      <p>Tidak ada produk yang ditemukan</p>
    </div>
    
    <!-- Products Grid -->
    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const route = useRoute()

// Filter state
const searchQuery = ref(route.query.q || '')
const selectedCategory = ref('')
const sortBy = ref('default')

// Ambil data produk saat halaman dimuat
onMounted(() => {
  productStore.fetchProducts()
  categoryStore.fetchCategories()
})

// Pantau perubahan query pencarian dari navbar
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || ''
})

// Daftar kategori unik
const categories = computed(() => {
  return categoryStore.categories.map(c => c.name)
})

// Produk yang sudah difilter dan diurutkan
const filteredProducts = computed(() => {
  let products = [...productStore.products]
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (selectedCategory.value) {
    products = products.filter(p => {
      const categoryName = p.category?.name || p.category
      return categoryName === selectedCategory.value
    })
  }
  
  // Sort
  switch (sortBy.value) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      products.sort((a, b) => b.name.localeCompare(a.name))
      break
  }
  
  return products
})

const retry = () => {
  productStore.fetchProducts()
}
</script>

<style scoped>
.products-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
}

.products-header {
  text-align: center;
  margin-bottom: 3rem;
}

.products-header h1 {
  font-size: 2.5rem;
  color: #f3f3f3;
  margin-bottom: 0.5rem;
}

.products-header p {
  color: #f3f3f3;
  font-size: 1.1rem;
}

.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #838383;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-box {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 30px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #555555;
}

/* Loading Spinner */
.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error {
  text-align: center;
  padding: 4rem;
  background: #fee;
  border-radius: 12px;
  color: #c00;
}

.btn-retry {
  margin-top: 1rem;
  padding: 10px 20px;
  background: #c00;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Empty State */
.empty {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  color: #999;
  font-size: 1.2rem;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .products-header h1 {
    font-size: 2rem;
  }
  
  .products-toolbar {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-box {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
}
</style>