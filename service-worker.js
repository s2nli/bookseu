/* Minimal app-shell service worker (makes the app installable).
   Only same-origin shell files are cached; the embedded site is never intercepted. */
const CACHE = 'cx-books-shell-v2';
const SHELL = ['./', './index.html', './css/codexstudys-popup.css', './js/codexstudys-popup.js', './manifest.json', './images/icon-192.png', './images/icon-512.png', './images/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res;
  }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
