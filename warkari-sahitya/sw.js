/*
 * Service worker.
 *
 * Chrome will not offer to install a site without one that handles fetch, so
 * this exists first to make the page installable. It earns its keep by putting
 * the shell and the artwork in a cache: the paintings are the largest thing
 * here by far, and a second visit should not pay for them again.
 *
 * Nothing about playback is cached. Audio comes from YouTube's own iframe over
 * the network, and this worker deliberately never touches those requests.
 */

const VERSION = 'bhajan-mandal-v1';

/* The shell only: the page, its manifest and the launcher icons.
 *
 * The artwork is deliberately NOT listed. There are six variants and a device
 * uses exactly one, chosen by media query and density, which the worker cannot
 * know in advance. Precaching the lot would pull about a megabyte of paintings
 * nobody asked for on a first visit. The fetch handler below caches whichever
 * one the page actually requests, which is the one that matters offline.
 */
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './img/icon-192.png',
  './img/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      /* allSettled, not all: one missing file should not leave the site with
         no offline copy at all. */
      Promise.allSettled(SHELL.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  /* Only our own GETs. YouTube, Google Fonts and the Tailwind CDN are left to
     the network and the browser's own HTTP cache; intercepting a media stream
     would do real harm. */
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* The page itself: network first, so a redeploy is picked up straight away,
     with the cached copy as the offline answer. */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((r) => r || Response.error()))
    );
    return;
  }

  /* Everything else, the artwork above all: cache first. These files never
     change without a new filename. */
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
