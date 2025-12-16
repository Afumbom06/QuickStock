/* eslint-disable no-restricted-globals */
// Mini-ERP PWA Service Worker with Advanced Caching

const CACHE_NAME = 'mini-erp-v1.0.0';
const RUNTIME_CACHE = 'mini-erp-runtime-v1';
const BACKGROUND_SYNC_TAG = 'sync-mini-erp-data';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy 1: Cache-first for static assets (JS, CSS, images, fonts)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Strategy 2: Stale-while-revalidate for HTML pages
  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Strategy 3: Network-first with cache fallback for API calls
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // Default: Network-first
  event.respondWith(networkFirstWithCache(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[ServiceWorker] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[ServiceWorker] Fetch failed:', error);
    
    // Return offline page if available
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  // Fetch fresh data in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  // Return cached immediately if available, otherwise wait for network
  return cached || fetchPromise;
}

// Network-first with cache fallback
async function networkFirstWithCache(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, checking cache:', request.url);
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync triggered:', event.tag);

  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(syncPendingData());
  }
});

// Sync pending data to server
async function syncPendingData() {
  console.log('[ServiceWorker] Syncing pending data...');
  
  try {
    // Open IndexedDB and get pending items
    const db = await openIndexedDB();
    const pendingItems = await getPendingItems(db);
    
    if (pendingItems.length === 0) {
      console.log('[ServiceWorker] No pending items to sync');
      return;
    }

    // Sync each item
    const syncPromises = pendingItems.map(item => syncItem(item));
    await Promise.all(syncPromises);
    
    // Show success notification
    self.registration.showNotification('Mini-ERP Sync', {
      body: `Successfully synced ${pendingItems.length} items`,
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      tag: 'sync-success',
    });
    
    console.log('[ServiceWorker] Sync completed successfully');
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    throw error; // Retry sync later
  }
}

// Helper: Open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MiniERPDB', 1);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Helper: Get pending items from IndexedDB
async function getPendingItems(db) {
  const stores = ['sales', 'expenses', 'inventory', 'customers', 'debts'];
  const pendingItems = [];
  
  for (const storeName of stores) {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    const items = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Filter unsynced items
    const unsynced = items.filter(item => !item.synced);
    pendingItems.push(...unsynced.map(item => ({ ...item, storeName })));
  }
  
  return pendingItems;
}

// Helper: Sync individual item
async function syncItem(item) {
  // In a real app, this would POST to your API
  // For now, we'll simulate it
  console.log('[ServiceWorker] Syncing item:', item);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mark as synced in IndexedDB
  const db = await openIndexedDB();
  const transaction = db.transaction(item.storeName, 'readwrite');
  const store = transaction.objectStore(item.storeName);
  
  const updatedItem = { ...item, synced: true };
  delete updatedItem.storeName;
  
  store.put(updatedItem);
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'TRIGGER_SYNC') {
    // Manually trigger background sync
    if (self.registration.sync) {
      self.registration.sync.register(BACKGROUND_SYNC_TAG)
        .then(() => {
          console.log('[ServiceWorker] Background sync registered');
          event.ports[0].postMessage({ success: true });
        })
        .catch((error) => {
          console.error('[ServiceWorker] Sync registration failed:', error);
          event.ports[0].postMessage({ success: false, error: error.message });
        });
    }
  }

  if (event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize()
      .then(size => {
        event.ports[0].postMessage({ size });
      });
  }
});

// Helper: Get total cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    totalSize += keys.length;
  }
  
  return totalSize;
}

// Push notification event (optional - for future)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New update available',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'close', title: 'Close' },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Mini-ERP', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[ServiceWorker] Loaded successfully');
