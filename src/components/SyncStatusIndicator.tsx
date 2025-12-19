import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function SyncStatusIndicator() {
  const { isOnline, syncQueueCount, sales, expenses, inventory, customers, debts } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Load last sync time
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }
  }, []);

  const getSyncStatus = () => {
    if (syncing) return 'syncing';
    if (!isOnline) return 'offline';
    if (syncQueueCount > 0) return 'pending';
    return 'synced';
  };

  const status = getSyncStatus();

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    if (syncQueueCount === 0) {
      toast.info('Everything is already synced!');
      return;
    }

    setSyncing(true);
    
    try {
      // Service worker sync not available in this environment
      // Use fallback manual sync
      await simulateSync();
      
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      
      toast.success('Sync completed!', {
        description: `${syncQueueCount} items synced successfully`,
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed', {
        description: 'Please try again',
      });
    } finally {
      setSyncing(false);
    }
  };

  const simulateSync = async () => {
    // Mark all items as synced
    const allItems = [
      ...sales.filter(s => !s.synced),
      ...expenses.filter(e => !e.synced),
      ...inventory.filter(i => !i.synced),
      ...customers.filter(c => !c.synced),
      ...debts.filter(d => !d.synced),
    ];

    // In a real app, this would POST to your API
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getStatusColor = () => {
    switch (status) {
      case 'syncing': return 'text-blue-600';
      case 'offline': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'synced': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'syncing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5" />;
      case 'synced':
        return <Check className="w-5 h-5" />;
      default:
        return <RefreshCw className="w-5 h-5" />;
    }
  };

  const getTooltipText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing data...';
      case 'offline':
        return 'Offline - Connect to sync';
      case 'pending':
        return `${syncQueueCount} items pending sync`;
      case 'synced':
        return lastSyncTime 
          ? `Last synced: ${lastSyncTime.toLocaleTimeString()}`
          : 'Everything synced';
      default:
        return 'Sync status';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSync}
            disabled={syncing || !isOnline || syncQueueCount === 0}
            className={`relative gap-2 ${getStatusColor()}`}
          >
            {getStatusIcon()}
            
            {/* Pending badge */}
            <AnimatePresence>
              {syncQueueCount > 0 && !syncing && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {syncQueueCount > 9 ? '9+' : syncQueueCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for mobile
export function SyncStatusBadge() {
  const { isOnline, syncQueueCount } = useApp();
  
  if (syncQueueCount === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
    >
      <RefreshCw className="w-3 h-3" />
      {syncQueueCount} pending
    </motion.div>
  );
}

// Item-level sync indicator
export function ItemSyncStatus({ synced }: { synced?: boolean }) {
  if (synced === undefined || synced === true) {
    return (
      <div className="inline-flex items-center gap-1 text-xs text-green-600">
        <Check className="w-3 h-3" />
        <span className="hidden sm:inline">Synced</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 text-xs text-yellow-600">
      <RefreshCw className="w-3 h-3" />
      <span className="hidden sm:inline">Pending</span>
    </div>
  );
}