import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  DollarSign, 
  Palette, 
  RefreshCw, 
  Download,
  ChevronRight,
  Settings as SettingsIcon,
  AlertCircle,
  User,
  Smartphone,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Zap,
  Globe,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Database,
  FileText,
  Lock,
  Heart,
  Star,
  TrendingUp,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { ProgressBar } from '../components/ui/progress';

export function Settings() {
  const { user: appUser, syncQueueCount, isOnline } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';

  const settingsCategories = [
    {
      title: 'Shop & Business',
      icon: Store,
      color: 'blue',
      items: [
        {
          id: 'shop-info',
          title: 'Shop Information',
          description: 'Edit shop name, owner, phone, and logo',
          icon: Store,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          route: '/settings/shop-info',
        },
        {
          id: 'currency',
          title: 'Currency Settings',
          description: `Current: ${appUser?.currency || 'XAF'}`,
          icon: DollarSign,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          route: '/settings/currency',
        },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      color: 'purple',
      items: [
        {
          id: 'theme',
          title: 'Theme Mode',
          description: `Current: ${appUser?.theme === 'light' ? 'Light Mode' : 'Dark Mode'}`,
          icon: appUser?.theme === 'light' ? Sun : Moon,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          route: '/settings/theme',
        },
      ],
    },
    {
      title: 'Data & Sync',
      icon: Database,
      color: 'orange',
      items: [
        {
          id: 'sync',
          title: 'Backup & Sync',
          description: isOnline ? `${syncQueueCount} items pending` : 'Offline mode',
          icon: RefreshCw,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          route: '/settings/sync',
          badge: syncQueueCount > 0 ? syncQueueCount.toString() : undefined,
          badgeVariant: syncQueueCount > 0 ? 'destructive' : undefined,
        },
        {
          id: 'export',
          title: 'Data Export',
          description: 'Download sales, expenses, inventory, and debts',
          icon: Download,
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          route: '/settings/export',
        },
      ],
    },
    {
      title: 'Account & Profile',
      icon: User,
      color: 'pink',
      items: [
        {
          id: 'account',
          title: 'Account Settings',
          description: 'Language, profile, and preferences',
          icon: User,
          iconBg: 'bg-pink-100',
          iconColor: 'text-pink-600',
          route: '/settings/account',
        },
      ],
    },
  ];

  // Calculate storage usage (mock data)
  const storageUsed = 45; // MB
  const storageTotal = 100; // MB
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">Manage your shop and app preferences</p>
              </div>
            </div>
            {isAdmin && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 gap-2">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            )}
          </div>

          {/* Quick Status Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-3 border"
            >
              <div className="flex items-center gap-2 mb-1">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-600">Connection</span>
              </div>
              <p className="text-sm text-gray-900">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-3 border"
            >
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Storage</span>
              </div>
              <p className="text-sm text-gray-900">
                {storageUsed}MB / {storageTotal}MB
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-3 border"
            >
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">Sync Queue</span>
              </div>
              <p className="text-sm text-gray-900">
                {syncQueueCount} items
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-3 border"
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">App Version</span>
              </div>
              <p className="text-sm text-gray-900">v1.0.0</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6 pb-24">
          {/* Offline Warning */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-orange-300 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-orange-900">
                        <strong>Offline Mode Active</strong>
                      </p>
                      <p className="text-xs text-orange-800 mt-1">
                        You can still update settings. Changes will sync automatically when you're back online.
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                      {syncQueueCount} pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                    {appUser?.shopName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl text-gray-900 mb-1">
                      {appUser?.shopName || user?.shopName || 'My Shop'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user?.name || 'Shop Owner'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        {appUser?.phone || user?.phone || 'No phone'}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {appUser?.currency || 'XAF'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={isOnline ? 'default' : 'secondary'} className={`${isOnline ? 'bg-green-600' : 'bg-gray-400'} gap-2`}>
                      {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                      {isOnline ? 'Online' : 'Offline'}
                    </Badge>
                    {isAdmin && (
                      <Badge className="bg-purple-600 gap-2">
                        <Shield className="w-3 h-3" />
                        Admin Access
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Storage Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Local Storage</span>
                    <span className="text-gray-900">
                      {storageUsed}MB of {storageTotal}MB used
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${storagePercent}%` }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        storagePercent > 80
                          ? 'bg-red-500'
                          : storagePercent > 60
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <Package className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Inventory</p>
                      <p className="text-sm text-gray-900">12MB</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Sales</p>
                      <p className="text-sm text-gray-900">15MB</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Expenses</p>
                      <p className="text-sm text-gray-900">8MB</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Customers</p>
                      <p className="text-sm text-gray-900">10MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Categories */}
          {settingsCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + categoryIndex * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CategoryIcon className={`w-5 h-5 text-${category.color}-600`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {category.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + categoryIndex * 0.1 + itemIndex * 0.05 }}
                          >
                            <div
                              className="flex items-center gap-4 p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
                              onClick={() => navigate(item.route)}
                            >
                              <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-6 h-6 ${item.iconColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-sm text-gray-900">{item.title}</h3>
                                  {item.badge && (
                                    <Badge variant={item.badgeVariant as any} className="text-xs">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 truncate">{item.description}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-auto py-4"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900">View Profile</p>
                      <p className="text-xs text-gray-600">Manage your account</p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start gap-3 h-auto py-4"
                    onClick={() => navigate('/reports')}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-900">View Reports</p>
                      <p className="text-xs text-gray-600">Business analytics</p>
                    </div>
                  </Button>

                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="justify-start gap-3 h-auto py-4 sm:col-span-2"
                      onClick={() => navigate('/admin-dashboard')}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-900">Admin Dashboard</p>
                        <p className="text-xs text-gray-600">Manage branches, staff & system</p>
                      </div>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Help & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get support, view documentation, or report issues
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">
                        📚 Documentation
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        💬 Support
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        🐛 Report Bug
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Info Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Store className="w-5 h-5" />
                    <span className="text-lg">QuickStock</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mini-ERP PWA for Small Shops & Hawkers in Cameroon
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Version 1.0.0
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      IndexedDB Storage
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <WifiOff className="w-3 h-3" />
                      Offline-First
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-400">
                      All data stored locally for offline-first operation
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                      Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Cameroon
                    </p>
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
