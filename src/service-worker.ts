//import { precacheAndRoute } from 'workbox-precaching';
//precacheAndRoute(self.__WB_MANIFEST || []);

//workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

self.addEventListener('fetch', function() {
  console.log("fetched")
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
