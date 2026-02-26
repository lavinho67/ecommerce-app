import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCategories() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/categories')
      if (response.data.success) {
        categories.value = response.data.data
      }
    } catch (err) {
      error.value = 'Gagal memuat kategori'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  function getCategoryById(id) {
    return categories.value.find(c => c.id === id)
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById
  }
})