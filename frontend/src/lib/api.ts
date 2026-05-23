import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Treat 422 as a resolved response so axios never throws a JS exception for
  // validation errors — callers check the status code and handle it silently.
  validateStatus: (s) => (s >= 200 && s < 300) || s === 422,
})

// Attach token + current locale on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('_t')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const lang = localStorage.getItem('lang') ?? 'en'
  config.headers['Accept-Language'] = lang
  return config
})

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('_t')
      localStorage.removeItem('_u')
      localStorage.removeItem('_lt')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
