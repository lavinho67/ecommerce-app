import axios from 'axios'

// Gunakan environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

console.log('API URL:', API_URL) // Untuk debugging

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Naikkan timeout karena ngrok bisa lambat
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
})

// Interceptor untuk menambahkan token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method.toUpperCase(), config.url)
    return config
  },
  error => Promise.reject(error)
)

// Interceptor untuk response
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api