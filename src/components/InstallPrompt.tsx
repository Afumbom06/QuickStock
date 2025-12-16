import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 3 seconds delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual instructions
    if (iOS && !isIOSStandalone) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
      
      // Show success message
      showInstallSuccess();
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show native install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
    } else {
      console.log('User dismissed the install prompt');
      handleDismiss();
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const showInstallSuccess = () => {
    // Show success notification (implement separately)
    const event = new CustomEvent('pwa-installed');
    window.dispatchEvent(event);
  };

  // Don't show if installed or not showing
  if (isInstalled || !showPrompt) return null;

  // iOS Instructions
  if (isIOS) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96"
        >
          <Card className="border-blue-600 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm text-gray-900">Install Mini-ERP</h3>
                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Install this app on your iPhone: tap{' '}
                    <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded text-xs">
                      ↑
                    </span>{' '}
                    then <strong>Add to Home Screen</strong>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
                    className="w-full text-xs"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Android/Desktop Prompt
  return (
    <AnimatePresence>
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
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-gray-900">Install Mini-ERP</h3>
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Install for faster access and offline use. Works without internet!
                </p>
                
                {/* Benefits */}
                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Works offline
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Faster loading
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Home screen icon
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleInstallClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Install App
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDismiss}
                  >
                    Not now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
