import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const featuredProducts = computed(() => {
    return products.value.slice(0, 4)
  })

  // ============================================
  // STOCK UPDATES - disimpan terpisah di localStorage
  // Key: 'stock_updates' → { productId: jumlahStokBaru }
  // Ini TIDAK akan hilang saat fetchProducts dari API
  // ============================================
  
  function getStockUpdates() {
    const saved = localStorage.getItem('stock_updates')
    return saved ? JSON.parse(saved) : {}
  }

  function saveStockUpdate(productId, newStock) {
    const updates = getStockUpdates()
    updates[String(productId)] = newStock
    localStorage.setItem('stock_updates', JSON.stringify(updates))
  }

  // Terapkan perubahan stok dari localStorage ke products
  function applyStockUpdates() {
    const updates = getStockUpdates()
    if (Object.keys(updates).length === 0) return
    
    products.value = products.value.map(product => {
      const savedStock = updates[String(product.id)]
      if (savedStock !== undefined) {
        return { ...product, stock: savedStock }
      }
      return product
    })
  }

  // GET all products
async function fetchProducts() {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get('/products')
    if (response.data.success) {
      products.value = response.data.data.map(product => {
        if (product.image && !product.image.startsWith('http')) {
          product.image = `http://localhost:8000${product.image}`
        }
        return product
      })
    }
  } catch (err) {
    error.value = 'Gagal memuat produk'
    console.error(err)
  } finally {
    loading.value = false
  }
}

  // GET product by id
  function getProductById(id) {
    return products.value.find(p => p.id == id)
  }

  // POST new product (admin only)
async function createProduct(productData) {
  loading.value = true
  error.value = null
  
  try {
    const formData = new FormData()
    formData.append('name', productData.name)
    formData.append('description', productData.description)
    formData.append('price', productData.price)
    formData.append('category_id', productData.category_id)  // PASTIKAN INI 'category_id'
    formData.append('stock', productData.stock)
    formData.append('image', productData.image)

    // DEBUG: Lihat isi formData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await api.post('/products', formData)

    if (response.data.success) {
      const newProduct = response.data.data
      if (newProduct.image && !newProduct.image.startsWith('http')) {
        newProduct.image = `http://localhost:8000${newProduct.image}`
      }
      products.value.push(newProduct)
      return true
    }
    return false
  } catch (err) {
    console.error('Create product error:', err.response?.data || err)
    error.value = err.response?.data?.errors || 'Gagal menambah produk'
    return false
  } finally {
    loading.value = false
  }
}

  // PUT update product (admin only)
  async function updateProduct(id, productData) {
    loading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      
      if (productData.name) formData.append('name', productData.name)
      if (productData.description) formData.append('description', productData.description)
      if (productData.price) formData.append('price', productData.price)
      if (productData.category_id) formData.append('category_id', productData.category_id)
      if (productData.stock) formData.append('stock', productData.stock)
      if (productData.image) formData.append('image', productData.image)

      const response = await api.post(`/products/${id}`, formData)

      if (response.data.success) {
        const index = products.value.findIndex(p => p.id == id)
        if (index !== -1) {
          const updatedProduct = response.data.data
          if (updatedProduct.image && !updatedProduct.image.startsWith('http')) {
            updatedProduct.image = `http://localhost:8000${updatedProduct.image}`
          }
          products.value[index] = updatedProduct
          
          // Update juga stock_updates jika admin mengubah stok
          if (productData.stock) {
            saveStockUpdate(id, parseInt(productData.stock))
          }
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Update product error:', err.response?.data || err)
      error.value = err.response?.data?.errors || 'Gagal update produk'
      return false
    } finally {
      loading.value = false
    }
  }

  // DELETE product (admin only)
  async function deleteProduct(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.delete(`/products/${id}`)
      
      if (response.data.success) {
        products.value = products.value.filter(p => p.id != id)
        
        // Hapus juga dari stock_updates
        const updates = getStockUpdates()
        delete updates[String(id)]
        localStorage.setItem('stock_updates', JSON.stringify(updates))
        
        return true
      }
      return false
    } catch (err) {
      console.error('Delete product error:', err.response?.data || err)
      error.value = err.response?.data?.message || 'Gagal hapus produk'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    featuredProducts,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }
})