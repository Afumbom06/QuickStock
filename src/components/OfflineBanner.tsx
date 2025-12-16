import { useApp } from '../contexts/AppContext';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function OfflineBanner() {
  const { isOnline } = useApp();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span>
                <strong>You are offline</strong> — Changes saved locally and will sync when online
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OnlineIndicator() {
  const { isOnline } = useApp();

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Wifi className="w-4 h-4 text-green-600" />
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <WifiOff className="w-4 h-4 text-red-600" />
        </>
      )}
    </div>
  );
}
