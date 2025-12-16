import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { skipWaiting } from '../utils/pwa';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newWorker, setNewWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const handleUpdateAvailable = (event: any) => {
      console.log('[PWA] Update available');
      setNewWorker(event.detail.worker);
      setShowUpdate(true);
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = () => {
    if (newWorker) {
      skipWaiting(newWorker);
      setShowUpdate(false);
      
      // Reload will happen automatically when controller changes
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96"
        >
          <Card className="border-blue-600 shadow-2xl bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900">Update Available</h3>
                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    A new version of Mini-ERP is ready. Update now for the latest features!
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdate}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Update Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDismiss}
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
