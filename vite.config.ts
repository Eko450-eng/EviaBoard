// import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { defineConfig } from 'vite';

export default defineConfig({
  // define: {
  //   'process.env.NODE_ENV': process.env.NODE_ENV === 'production'
  //     ? '"production"'
  //     : '"development"'
  // },
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: 'injectManifest',
      injectManifest: {
        swSrc: 'src/service-worker.js',
        swDest: 'build/service-worker.js'
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
});
