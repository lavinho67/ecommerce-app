import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // Halaman ini perlu login
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true } // Halaman ini perlu login
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: { requiresAuth: true } // Halaman ini perlu login
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true } // Halaman ini perlu login
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true } // Halaman ini perlu login
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true } // Perlu login DAN admin
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue')
      // Halaman publik, tidak perlu login
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true } // Hanya untuk yang belum login
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true } // Hanya untuk yang belum login
    },
    {
  path: '/orders',
  name: 'orders',
  component: () => import('../views/OrdersView.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/profile',
  name: 'profile',
  component: () => import('../views/ProfileView.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/admin/orders',
  name: 'admin-orders',
  component: () => import('../views/AdminOrdersView.vue'),
  meta: { requiresAuth: true, requiresAdmin: true }
}
  ]
})

// Navigation Guard - Proteksi halaman
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  console.log('Navigation Guard:', { 
    to: to.name, 
    isAuthenticated, 
    isAdmin,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest,
    requiresAdmin: to.meta.requiresAdmin
  })

  // Jika halaman memerlukan auth tapi user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirect to login: requiresAuth')
    return { name: 'login' }  // ← LANGSUNG RETURN, tanpa next()
  }
  
  // Jika halaman khusus admin tapi user bukan admin
  else if (to.meta.requiresAdmin && !isAdmin) {
    console.log('Redirect to home: not admin')
    return { name: 'home' }  // ← LANGSUNG RETURN, tanpa next()
  }
  
  // Jika halaman login/register tapi user sudah login
  else if (to.meta.requiresGuest && isAuthenticated) {
    console.log('Redirect to home: already logged in')
    return { name: 'home' }  // ← LANGSUNG RETURN, tanpa next()
  }
  
  // Lanjutkan (return true)
  return true
})

export default router