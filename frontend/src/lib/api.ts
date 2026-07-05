import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Send/receive the httpOnly Sanctum session cookie, and read the
  // XSRF-TOKEN cookie (set by GET /sanctum/csrf-cookie) into the
  // X-XSRF-TOKEN header on unsafe requests, as Laravel's SPA auth expects.
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  // Treat 422 as a resolved response so axios never throws a JS exception for
  // validation errors — callers check the status code and handle it silently.
  validateStatus: (s) => (s >= 200 && s < 300) || s === 422,
})

function hasXsrfCookie(): boolean {
  return document.cookie.split('; ').some((c) => c.startsWith('XSRF-TOKEN='))
}

let csrfReady: Promise<unknown> | null = hasXsrfCookie() ? Promise.resolve() : null

// Ensure the XSRF-TOKEN cookie exists before any mutating request — Laravel's
// stateful SPA auth requires it on every unsafe (non-GET) request from the
// SPA's origin. Attach current locale on every request.
api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase()
  if (method && method !== 'get' && !hasXsrfCookie()) {
    csrfReady ??= api.get('/csrf-cookie').finally(() => { csrfReady = null })
    await csrfReady
  }
  const lang = localStorage.getItem('lang') ?? 'en'
  config.headers['Accept-Language'] = lang
  return config
})

// Auto-redirect to login on 401 (expired/invalid session) — except for the
// silent session-check on app boot (GET /me), where a 401 just means "not
// logged in yet" and should not force-navigate anonymous visitors off public
// pages.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== '/me') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
