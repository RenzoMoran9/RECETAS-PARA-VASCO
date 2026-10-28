/* Guarda la app en el teléfono para que funcione sin internet. */
const VERSION = 'vasco-v3';
const APP = [
  './',
  'index.html',
  'css/app.css',
  'js/ingredientes.js',
  'js/icons.js',
  'js/recetas.js',
  'js/guia.js',
  'js/planner.js',
  'js/app.js',
  'manifest.webmanifest',
  'img/icon.svg',
  'img/icon-maskable-512.png',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Tipografías de Google: se guardan la primera vez que se usan
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(VERSION).then((c) =>
        c.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              c.put(req, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Archivos de la app: primero la red (para recibir mejoras), si no hay señal, lo guardado
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
  );
});
