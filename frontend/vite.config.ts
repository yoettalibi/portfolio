import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://ettalibi.com/backend/public',
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