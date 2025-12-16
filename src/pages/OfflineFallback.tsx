import { WifiOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

export function OfflineFallback() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-6"
        >
          <WifiOff className="w-12 h-12 text-gray-500" />
        </motion.div>

        <h1 className="text-3xl text-gray-900 mb-3">You're Offline</h1>
        <p className="text-lg text-gray-600 mb-8">
          Please connect to the internet to continue using Mini-ERP for the first time.
        </p>

        <Button onClick={handleReload} size="lg" className="w-full">
          Try Again
        </Button>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            💡 <strong>Tip:</strong> Once you've logged in, you'll be able to use Mini-ERP offline!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
