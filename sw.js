// Service worker — permet d'ouvrir et d'utiliser Code 26 sans connexion
// (chiffrer/déchiffrer en local). Le Coffre en ligne a toujours besoin
// d'internet pour se connecter et synchroniser.
//
// IMPORTANT : si tu modifies un fichier de la liste PRECACHE, change ce
// numéro de version (ex: 'code26-v2'), sinon les téléphones garderont
// l'ancienne version en cache.
const CACHE_NAME = 'code26-v2';

const PRECACHE = [
  './',
  'index.html',
  'fichiers.html',
  'coffre.html',
  'recuperation.html',
  'manifest.json',
  'assets/style.css',
  'assets/rain.js',
  'assets/supabase-config.js',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.origin === self.location.origin){
    // Fichiers du site : on sert le cache d'abord (rapide, marche hors ligne),
    // et on met à jour le cache en arrière-plan si le réseau répond.
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200){
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  } else {
    // Scripts externes (Supabase, fflate…) et appels à Supabase :
    // réseau d'abord, cache en secours si hors ligne.
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200 && req.url.includes('cdn.jsdelivr.net')){
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
