importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js',
);

self.__WB_MANIFEST;

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// tslint:disable-next-line
self.addEventListener('install', (event) => {
	console.log('Service Worker installing.');
});

// tslint:disable-next-line
self.addEventListener('activate', (event) => {
	console.log('Service Worker activated.');
});

self.addEventListener('fetch', function () {
	console.log('fetched');
	return;
});

self.addEventListener('push', function (event) {
	console.log('Push');
	const payload = event.data?.text() ?? 'no payload';
	const registration = self.registration;
	event.waitUntil(
		registration.showNotification('Eviaboard', {
			body: payload,
		}),
	);
});
