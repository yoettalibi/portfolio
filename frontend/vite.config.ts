import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  // `vite preview` uses its own proxy config — needed so the prerender script
  // (scripts/prerender.mjs) can fetch live API data like /api/projects.
  preview: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom'))    return 'vendor-react'
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n'
          }
        },
      },
    },
  },
})