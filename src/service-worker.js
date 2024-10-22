import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

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

self.addEventListener('push', function(event) {
  const payload = event.data?.text() ?? 'no payload';
  const registration = (self).registration;
  event.waitUntil(
    registration.showNotification('Eviaboard', {
      body: payload
    })
  );
});
