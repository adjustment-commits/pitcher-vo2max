// =============================
// 投手 × VO₂max — Flipbook PWA
// =============================

const CACHE_NAME = "pitcher-vo2max-v1";
const urlsToCache = [
  "index.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  // CSSや画像、フォントなどを後で追加可
];

// インストール時にキャッシュ登録
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Caching app shell...");
      return cache.addAll(urlsToCache);
    })
  );
});

// リクエストをキャッシュから返却
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあれば即返す／なければネットワークへ
      return response || fetch(event.request);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  console.log("[SW] Activated and cleaned old caches");
});
