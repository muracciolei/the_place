/* THE PLACE service worker: solo app shell. Nunca guarda contenido de Google. */
const BASE = '/the_place/'
const CACHE = 'the-place-shell-v2'
const SHELL = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.webmanifest',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Prohibido por las condiciones de Google: ni respuestas de Places ni sus fotos.
  if (url.hostname === 'places.googleapis.com' || url.hostname === 'maps.googleapis.com') return
  // Tampoco cacheamos APIs de texto: siempre frescas.
  if (url.hostname.endsWith('wikipedia.org') || url.hostname === 'commons.wikimedia.org') return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(BASE + 'index.html', copy))
          return response
        })
        .catch(() => caches.match(BASE + 'index.html'))
    )
    return
  }

  if (url.origin === self.location.origin || url.hostname === 'upload.wikimedia.org') {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      }))
    )
  }
})
