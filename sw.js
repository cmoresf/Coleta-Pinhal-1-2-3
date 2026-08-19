const C = "pinhal-v3";
const ASSETS = ["./", "./index.html", "./icon.png"];
self.addEventListener("install", e => { self.skipWaiting();
  e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS))); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const req = e.request;
  // rede primeiro (atualiza quando online); cai para cache quando offline
  e.respondWith(
    fetch(req).then(resp => {
      const cp = resp.clone(); caches.open(C).then(c => c.put(req, cp)); return resp;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
