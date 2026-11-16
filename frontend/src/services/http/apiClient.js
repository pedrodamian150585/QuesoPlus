import axios from 'axios'

/**
 * Cliente HTTP Axios preparado para conectar el frontend de QuesoPlus
 * con el backend Node.js + Express + PostgreSQL 17.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qp_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalizedError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Error de comunicación con el servidor API REST.',
      details: error.response?.data?.errors || null
    }
    return Promise.reject(normalizedError)
  }
)

export default apiClient
