import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MyFinances',
        short_name: 'MyFinances',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'icons/icon-256.webp',
            sizes: '256x256',
            type: 'image/webp'
          }
        ],
        screenshots: [
          {
            src: 'screenshots/mobile.png',
            sizes: '378x821',
            type: 'image/png'
            // sin form_factor: se asume que es móvil
          },
          {
            src: 'screenshots/desktop.png',
            sizes: '1896x919',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst'
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'image'].includes(request.destination),
            handler: 'CacheFirst'
          }
        ]
      }
    })
  ],
})
