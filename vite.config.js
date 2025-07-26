import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Snitchr - Anonymous Confessions',
        short_name: 'Snitchr',
        description: 'Share your anonymous confessions',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: []
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],

  server: {
    host: true, // listen on all addresses
    allowedHosts: [
      'b82b3e400bda.ngrok-free.app',
      '172.16.1.112', // your phone's IP
    ]
  }
})
