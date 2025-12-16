// PWA Utilities - Service Worker Registration and Management

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    // Service worker registration is handled via index.html intercept
    // Skip registration to avoid MIME type errors in this environment
    console.log('[PWA] Service Worker registration skipped (using IndexedDB for offline support)');
    return null;
  } else {
    console.warn('[PWA] Service Workers not supported in this browser');
    return null;
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('[PWA] Service Worker unregistered:', success);
    return success;
  }
  return false;
};

export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('[PWA] Checked for updates');
  }
};

export const showUpdateNotification = (worker: ServiceWorker) => {
  // Create custom event for update notification
  const event = new CustomEvent('sw-update-available', { detail: { worker } });
  window.dispatchEvent(event);

  // Show browser notification if permission granted
  if (Notification.permission === 'granted') {
    new Notification('Mini-ERP Update Available', {
      body: 'A new version is ready. Refresh to update.',
      icon: '/icon-192x192.png',
      tag: 'app-update',
    });
  }
};

export const skipWaiting = (worker: ServiceWorker) => {
  worker.postMessage({ type: 'SKIP_WAITING' });
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  }
  return Notification.permission;
};

export const triggerBackgroundSync = async () => {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-mini-erp-data');
      console.log('[PWA] Background sync registered');
      return true;
    } catch (error) {
      console.error('[PWA] Background sync registration failed:', error);
      return false;
    }
  } else {
    console.warn('[PWA] Background sync not supported');
    return false;
  }
};

export const getCacheSize = async (): Promise<number> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.size || 0);
      };

      registration.active?.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );

      // Timeout after 2 seconds
      setTimeout(() => resolve(0), 2000);
    });
  }
  return 0;
};

export const clearCaches = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[PWA] All caches cleared');
    return true;
  }
  return false;
};

export const isPWAInstalled = (): boolean => {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return isStandalone || isIOSStandalone;
};

export const getInstallPromptEvent = (): Promise<any> => {
  return new Promise((resolve) => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      resolve(e);
    }, { once: true });
  });
};

export const checkOnlineStatus = (): boolean => {
  return navigator.onLine;
};

export const subscribeToOnlineStatus = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Estimate storage quota usage
export const getStorageEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usageInMB = (estimate.usage || 0) / (1024 * 1024);
    const quotaInMB = (estimate.quota || 0) / (1024 * 1024);
    const percentUsed = ((estimate.usage || 0) / (estimate.quota || 1)) * 100;

    return {
      usage: usageInMB.toFixed(2),
      quota: quotaInMB.toFixed(2),
      percentUsed: percentUsed.toFixed(2),
    };
  }
  return null;
};

// Check if app needs update
export const checkAppVersion = () => {
  const currentVersion = '1.0.0';
  const storedVersion = localStorage.getItem('app-version');

  if (storedVersion !== currentVersion) {
    localStorage.setItem('app-version', currentVersion);
    return { updated: true, version: currentVersion, previousVersion: storedVersion };
  }

  return { updated: false, version: currentVersion };
};

// Pre-cache important routes
export const precacheRoutes = async (routes: string[]) => {
  if ('caches' in window) {
    const cache = await caches.open('mini-erp-v1.0.0');
    await cache.addAll(routes);
    console.log('[PWA] Routes pre-cached:', routes);
  }
};

// Check if service worker is ready
export const isServiceWorkerReady = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.ready;
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  checkForUpdates,
  requestNotificationPermission,
  triggerBackgroundSync,
  getCacheSize,
  clearCaches,
  isPWAInstalled,
  checkOnlineStatus,
  subscribeToOnlineStatus,
  getStorageEstimate,
  checkAppVersion,
  precacheRoutes,
  isServiceWorkerReady,
};