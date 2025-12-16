import { Alert, AlertDescription } from '../ui/alert';
import { WifiOff, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OfflineIndicatorBannerProps {
  isOnline: boolean;
  message?: string;
}

export function OfflineIndicatorBanner({ isOnline, message }: OfflineIndicatorBannerProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="bg-yellow-50 border-yellow-200 mb-6">
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{message || 'Using offline data. Changes will sync when you reconnect.'}</span>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
