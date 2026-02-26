import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])

  // Getters
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const formattedTotalPrice = computed(() => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(totalPrice.value)
  })

  // Actions
  function addToCart(product, quantity = 1) {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock ?? 0,
        quantity: quantity
      })
    }
    
    // Simpan ke localStorage
    saveCartToLocalStorage()
  }

  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
    saveCartToLocalStorage()
  }

  function updateQuantity(productId, quantity) {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeFromCart(productId)
      } else {
        saveCartToLocalStorage()
      }
    }
  }

  function clearCart() {
    cartItems.value = []
    saveCartToLocalStorage()
  }

  // Local storage functions
  function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }

  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cartItems.value = JSON.parse(savedCart)
    }
  }

  return {
    // State
    cartItems,
    // Getters
    totalItems,
    totalPrice,
    formattedTotalPrice,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartFromLocalStorage
  }
})