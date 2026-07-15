import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    allowedHosts: true,
  },

  build: {
    // Target modern browsers — smaller output
    target: 'es2020',

    // Warn when any chunk exceeds 600 kB
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Vite 8 / rolldown requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core — changes rarely, long-term cached
            if (id.includes('react-dom') || id.includes('react-router-dom') || (id.includes('/react/') && !id.includes('react-qr') && !id.includes('react-dnd'))) {
              return 'vendor-react'
            }
            // Charting library — large, loaded only on dashboard pages
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) {
              return 'vendor-charts'
            }
            // Bootstrap
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap'
            }
            // QR Code
            if (id.includes('react-qr-code') || id.includes('qrcode')) {
              return 'vendor-qr'
            }
            // Drag-and-drop
            if (id.includes('react-dnd')) {
              return 'vendor-dnd'
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'vendor-axios'
            }
            // Everything else in node_modules
            return 'vendor-misc'
          }
        },
        // Organised output file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Vite 8 uses oxc (faster than esbuild) for minification
    minify: true,

    // Disable source maps for production (smaller output)
    sourcemap: false,
  },
})
