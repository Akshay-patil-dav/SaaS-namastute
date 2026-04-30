import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Use "@/api/config" instead of relative "../../api/config"
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true
  }
})
