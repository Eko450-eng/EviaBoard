// import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite';

export default defineConfig({
  // define: {
  //   'process.env.NODE_ENV': process.env.NODE_ENV === 'production'
  //     ? '"production"'
  //     : '"development"'
  // },
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto',
      strategies: 'injectManifest',
      injectManifest: {
        swSrc: './src/service-worker.js',
        swDest: '.svelte-kit/output/client/service-worker.js'
      },
      srcDir: 'src',
      filename: 'service-worker.js',
      manifest: {
        name: 'Eviaboard',
        short_name: 'Eviaboard',
        description: 'Your app description',
        theme_color: '#343944',
        background_color: '#343944',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      external: ['workbox-precaching'],
    }
  },
  optimizeDeps: {
    include: ['workbox-precaching']
  }
});
