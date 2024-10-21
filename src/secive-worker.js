// // svelte.config.js
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
//   kit: {
//     files: {
//       serviceWorker: 'src/my-sw.ts', // or `src/my-sw.ts`
//     }
//   }
// };
//
// export default config;
self.addEventListener('fetch', function() {
  return;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('push', function(event: any) {
  const payload = event.data?.text() ?? 'no payload';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registration = (self as any).registration as ServiceWorkerRegistration;
  event.waitUntil(
    registration.showNotification('SvelteKit Music Store', {
      body: payload
    })
  );
} as EventListener);

