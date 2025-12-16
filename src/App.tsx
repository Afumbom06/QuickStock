import { RouterProvider } from 'react-router';
import { router } from './utils/routes';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Service Worker is disabled in this environment
    // The app works fully offline using IndexedDB
    // Service worker registration is handled via index.html intercept
    
    // Set app version
    const currentVersion = '1.0.0';
    const storedVersion = localStorage.getItem('app-version');
    if (storedVersion !== currentVersion) {
      console.log(`[PWA] App version ${currentVersion}`);
      localStorage.setItem('app-version', currentVersion);
    }

    console.log('[PWA] Offline-first mode enabled via IndexedDB');
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;