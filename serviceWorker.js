{
    'use strict';
    const CACHE_VERSION = 1;
    const CURRENT_CACHE = `codecrok-xpost-v${CACHE_VERSION}`;

    const assets = [
        "/",
        "./index.html",
        "./index.css",
        "./App.js",
        "./img/delete.svg",
        "./img/edit.svg",
        "./img/lightbulb.svg",
        "./img/palette.svg",
        "./img/post-it.svg",
        "icons/favicon.ico",
        "./icons/apple-icon-57x57.png",
        "./icons/apple-icon-60x60.png",
        "./icons/apple-icon-72x72.png",
        "./icons/apple-icon-76x76.png",
        "./icons/apple-icon-114x114.png",
        "./icons/apple-icon-120x120.png",
        "./icons/apple-icon-144x144.png",
        "./icons/apple-icon-152x152.png",
        "./icons/apple-icon-180x180.png",
        "./icons/android-icon-192x192.png",
        "./icons/favicon-32x32.png",
        "./icons/favicon-96x96.png",
        "./icons/favicon-16x16.png",
        "./manifest.json"
    ];

    self.addEventListener("install", installEvent => {
        installEvent.waitUntil(
            caches.open(CURRENT_CACHE).then(cache => {
                cache.addAll(assets)
            })
        )
    });

    self.addEventListener("fetch", fetchEvent => {
        fetchEvent.respondWith(
            caches.match(fetchEvent.request).then(res => {
                return res || fetch(fetchEvent.request)
            })
        );
    });
}