import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RefreshCw, 
  Check, 
  AlertTriangle,
  Clock,
  Database,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  HardDrive,
  Activity,
  Zap,
  Shield,
  Info,
  Download,
  Server,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface SyncStep {
  name: string;
  status: 'pending' | 'syncing' | 'success' | 'error';
  count: number;
  icon: any;
  color: string;
}

export function SyncBackup() {
  const { user, sales, expenses, inventory, customers, debts, isOnline, syncQueueCount } = useApp();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSteps, setSyncSteps] = useState<SyncStep[]>([
    { name: 'Sales', status: 'pending', count: 0, icon: TrendingUp, color: 'green' },
    { name: 'Expenses', status: 'pending', count: 0, icon: BarChart3, color: 'red' },
    { name: 'Inventory', status: 'pending', count: 0, icon: Database, color: 'blue' },
    { name: 'Customers', status: 'pending', count: 0, icon: Activity, color: 'purple' },
    { name: 'Debts', status: 'pending', count: 0, icon: Server, color: 'orange' },
  ]);

  useEffect(() => {
    // Load last sync time from localStorage
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }

    // Update counts
    setSyncSteps([
      { name: 'Sales', status: 'pending', count: sales.filter(s => !s.synced).length, icon: TrendingUp, color: 'green' },
      { name: 'Expenses', status: 'pending', count: expenses.filter(e => !e.synced).length, icon: BarChart3, color: 'red' },
      { name: 'Inventory', status: 'pending', count: inventory.filter(i => !i.synced).length, icon: Database, color: 'blue' },
      { name: 'Customers', status: 'pending', count: customers.filter(c => !c.synced).length, icon: Activity, color: 'purple' },
      { name: 'Debts', status: 'pending', count: debts.filter(d => !d.synced).length, icon: Server, color: 'orange' },
    ]);
  }, [sales, expenses, inventory, customers, debts]);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline', {
        description: 'Please connect to the internet and try again',
      });
      return;
    }

    setSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate syncing each module
      for (let i = 0; i < syncSteps.length; i++) {
        // Update step to syncing
        setSyncSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'syncing' } : step
        ));

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update step to success
        setSyncSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'success' } : step
        ));

        // Update progress
        setSyncProgress(((i + 1) / syncSteps.length) * 100);
      }

      // Save last sync time
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toISOString());

      toast.success('Sync completed successfully!', {
        description: 'All your data is now backed up',
      });
    } catch (error) {
      toast.error('Sync failed', {
        description: 'Please try again later',
      });

      // Mark failed steps
      setSyncSteps(prev => prev.map(step => 
        step.status === 'syncing' ? { ...step, status: 'error' } : step
      ));
    } finally {
      setSyncing(false);
      
      // Reset steps after a delay
      setTimeout(() => {
        setSyncSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
        setSyncProgress(0);
      }, 3000);
    }
  };

  const getStatusIcon = (status: SyncStep['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'syncing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: SyncStep['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-600">Syncing...</Badge>;
      case 'success':
        return <Badge className="bg-green-600">Synced</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const totalPending = syncSteps.reduce((sum, step) => sum + step.count, 0);
  const totalItems = sales.length + expenses.length + inventory.length + customers.length + debts.length;
  const syncedItems = totalItems - totalPending;
  const syncPercentage = totalItems > 0 ? (syncedItems / totalItems) * 100 : 100;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-orange-50 to-amber-50 border-b"
      >
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="gap-2 mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Backup & Sync</h1>
                <p className="text-sm text-gray-600">Manage data synchronization and backups</p>
              </div>
            </div>
            {totalPending > 0 && (
              <Badge variant="destructive" className="gap-2">
                <AlertTriangle className="w-3 h-3" />
                {totalPending} pending
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6 pb-24">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Connection Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className={`border-l-4 ${isOnline ? 'border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-l-red-500 bg-gradient-to-br from-red-50 to-rose-50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${isOnline ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                          {isOnline ? (
                            <Wifi className="w-8 h-8 text-green-600" />
                          ) : (
                            <WifiOff className="w-8 h-8 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-xl mb-1 ${isOnline ? 'text-green-900' : 'text-red-900'}`}>
                            {isOnline ? 'Online & Connected' : 'Offline Mode'}
                          </h3>
                          <p className={`text-sm ${isOnline ? 'text-green-800' : 'text-red-800'}`}>
                            {isOnline ? 'Ready to sync your data to the cloud' : 'Connect to internet to enable sync'}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-600' : 'bg-red-600'} animate-pulse`} />
                            <span className={`text-xs ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                              {isOnline ? 'Active connection' : 'No connection'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isOnline ? (
                        <Cloud className="w-12 h-12 text-green-600" />
                      ) : (
                        <CloudOff className="w-12 h-12 text-red-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sync Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      Sync Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Last Sync Info */}
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Last Synced</p>
                          <p className="text-xl text-gray-900">
                            {lastSyncTime 
                              ? format(lastSyncTime, 'MMM dd, yyyy • h:mm a')
                              : 'Never synced'
                            }
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                          <Database className="w-8 h-8 text-orange-600" />
                        </div>
                      </div>

                      {/* Sync Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Data Synced</span>
                          <span className="text-gray-900">{Math.round(syncPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                            style={{ width: `${syncPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          {syncedItems} of {totalItems} items synced
                        </p>
                      </div>
                    </div>

                    {/* Manual Sync Button */}
                    <Button
                      onClick={handleManualSync}
                      disabled={!isOnline || syncing}
                      className="w-full gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                      size="lg"
                    >
                      {syncing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Syncing Data...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          {isOnline ? 'Sync Now' : 'Offline - Cannot Sync'}
                        </>
                      )}
                    </Button>

                    {/* Sync Progress */}
                    {syncing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <Progress value={syncProgress} className="h-3" />
                        <p className="text-sm text-center text-blue-900">
                          {Math.round(syncProgress)}% complete
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Modules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      Data Modules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {syncSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      return (
                        <motion.div
                          key={step.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            step.status === 'syncing' ? 'border-blue-400 bg-blue-50 shadow-md' :
                            step.status === 'success' ? 'border-green-400 bg-green-50' :
                            step.status === 'error' ? 'border-red-400 bg-red-50' :
                            'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-${step.color}-100 flex items-center justify-center`}>
                              <StepIcon className={`w-6 h-6 text-${step.color}-600`} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 mb-1">{step.name}</p>
                              <p className="text-xs text-gray-600">
                                {step.count > 0 ? `${step.count} unsynced items` : '✓ All items synced'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusIcon(step.status)}
                            {getStatusBadge(step.status)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-6 space-y-6"
              >
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-orange-600" />
                      Sync Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Total Items</span>
                        <HardDrive className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl text-gray-900">{totalItems}</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Synced</span>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-2xl text-green-900">{syncedItems}</p>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Pending</span>
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-2xl text-orange-900">{totalPending}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sync Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Sync Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-900">Background Sync</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Auto sync when online
                        </p>
                      </div>
                      <Badge className="bg-green-600">On</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-900">WiFi Only</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Sync on WiFi only
                        </p>
                      </div>
                      <Badge variant="secondary">Off</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-900">Frequency</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Check interval
                        </p>
                      </div>
                      <Badge variant="outline">5 min</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Info */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-blue-900">
                          <strong>Secure Backup:</strong>
                        </p>
                        <p className="text-xs text-blue-800">
                          All data is encrypted during transfer and storage to protect your business information.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">How Sync Works</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>All data is stored locally on your device first for offline access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>When online, unsynced changes are automatically pushed to the cloud</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Background sync happens automatically every 5 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Manual sync can be triggered anytime you want instant backup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Your data remains safe and accessible even when completely offline</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
