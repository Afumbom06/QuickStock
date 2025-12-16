import { Link, useLocation } from 'react-router';
import { 
  Home, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Calendar,
  TrendingUp,
  FileText,
  UserCog
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { TopNavBar } from './TopNavBar';
import { OfflineBanner } from './OfflineBanner';
import { InstallPrompt } from './InstallPrompt';
import { UpdateNotification } from './UpdateNotification';
import { InstallSuccessScreen } from './InstallSuccessScreen';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t } = useApp();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseNavigation = [
    { name: t('dashboard'), href: '/', icon: Home },
    { name: t('sales'), href: '/sales', icon: ShoppingCart },
    { name: t('expenses'), href: '/expenses', icon: DollarSign },
    { name: t('inventory'), href: '/inventory', icon: Package },
    { name: t('customers'), href: '/customers', icon: Users },
    { name: t('reports'), href: '/reports', icon: BarChart3, subItems: [
      { name: 'Daily Summary', href: '/reports/daily', icon: Calendar },
      { name: 'Weekly Summary', href: '/reports/weekly', icon: TrendingUp },
      { name: 'Mini Reports', href: '/reports/analytics', icon: FileText },
    ]},
  ];

  // Only show Admin menu item if user is admin
  const navigation = user?.role === 'admin' 
    ? [...baseNavigation, { name: 'Admin', href: '/admin-dashboard', icon: UserCog }, { name: t('settings'), href: '/settings', icon: Settings }]
    : [...baseNavigation, { name: t('settings'), href: '/settings', icon: Settings }];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* PWA Components */}
      <OfflineBanner />
      <InstallPrompt />
      <UpdateNotification />
      <InstallSuccessScreen />
      
      {/* Top Navigation Bar */}
      <TopNavBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-all duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="px-4 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubItemActive = hasSubItems && item.subItems.some(sub => location.pathname === sub.href);
            
            return (
              <div key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => !hasSubItems && setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive || isSubItemActive ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
                
                {/* Sub-items */}
                {hasSubItems && (
                  <div className="ml-4 space-y-1 mb-2">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = location.pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                            isSubActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <nav className="px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isSubItemActive = hasSubItems && item.subItems.some(sub => location.pathname === sub.href);
              
              return (
                <div key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                      isActive || isSubItemActive
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                  
                  {/* Sub-items */}
                  {hasSubItems && (
                    <div className="ml-4 space-y-1 mb-2">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                              isSubActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:p-8 p-4 pb-20 lg:pb-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}