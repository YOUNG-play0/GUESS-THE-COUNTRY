const CACHE_NAME = "geoquiz-v1";

const urlsToCache = [
  "/GUESS-THE-COUNTRY/",
  "/GUESS-THE-COUNTRY/index.html",
  "/GUESS-THE-COUNTRY/manifest.json",
  "/GUESS-THE-COUNTRY/icon-192.png",
  "/GUESS-THE-COUNTRY/icon-512.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// FETCH (offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
