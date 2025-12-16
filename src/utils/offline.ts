// Offline detection and sync utilities
import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export async function addToSyncQueue(action: string, data: any) {
  const { db } = await import('./db');
  await db.add('syncQueue', {
    action,
    data,
    timestamp: new Date().toISOString(),
  });
}

export async function getSyncQueueCount(): Promise<number> {
  const { db } = await import('./db');
  const queue = await db.getAll<any>('syncQueue');
  return queue.length;
}
