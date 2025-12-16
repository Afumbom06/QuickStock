import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, Smartphone, Zap, Wifi, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InstallSuccessScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Listen for PWA installed event
    const handlePWAInstalled = () => {
      // Check if we've shown this before
      const hasShownSuccess = localStorage.getItem('pwa-success-shown');
      if (hasShownSuccess) return;

      setShow(true);
      localStorage.setItem('pwa-success-shown', 'true');
    };

    window.addEventListener('pwa-installed', handlePWAInstalled);

    // Also check on mount if just installed
    const justInstalled = localStorage.getItem('pwa-installed') === 'true';
    const hasShownSuccess = localStorage.getItem('pwa-success-shown');
    
    if (justInstalled && !hasShownSuccess) {
      setTimeout(() => {
        setShow(true);
        localStorage.setItem('pwa-success-shown', 'true');
      }, 1000);
    }

    return () => {
      window.removeEventListener('pwa-installed', handlePWAInstalled);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="border-green-500 shadow-2xl">
              <CardContent className="p-8 text-center">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl text-gray-900 mb-2">
                  🎉 App Installed Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Mini-ERP is now ready to use offline
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8 text-left">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wifi className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900">Works Offline</h4>
                      <p className="text-xs text-gray-600">Use without internet connection</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900">Lightning Fast</h4>
                      <p className="text-xs text-gray-600">Instant loading from home screen</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900">Native Experience</h4>
                      <p className="text-xs text-gray-600">Feels like a real mobile app</p>
                    </div>
                  </motion.div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-gray-50 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>How to access:</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Look for the <strong>Mini-ERP</strong> icon on your home screen.
                    Tap it to launch the app instantly!
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleClose}
                  className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Start Using App
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
