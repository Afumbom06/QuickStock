import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { motion } from 'motion/react';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from 'figma:asset/c9a9983ef56bf29abb9bcc4cee03e20d40950b10.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, Calendar, Wifi, WifiOff, Search, Bell, User, Settings, LogOut, Store, ChevronDown, Sun, Moon, Languages } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function TopNavBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isOnline, syncQueueCount, t, user: appUser, language, changeLanguage, theme, toggleTheme } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    changeLanguage(newLang);
    toast.success(
      newLang === 'en' ? 'Language changed to English' : 'Langue changée en Français',
      { duration: 2000 }
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(
      theme === 'light' 
        ? (language === 'en' ? 'Dark mode enabled' : 'Mode sombre activé')
        : (language === 'en' ? 'Light mode enabled' : 'Mode clair activé'),
      { duration: 2000 }
    );
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section - Logo & Business Info */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 flex items-center">
              <ImageWithFallback 
                src={logo} 
                alt="QuickStock" 
                className="h-10 w-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:invert"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-gray-900 dark:text-white leading-none">
                {appUser?.businessName || 'QuickStock'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1">
                Your Quick Fix
              </p>
            </div>
          </Link>
        </div>

        {/* Center Section - Date & Sync Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
            <Calendar className="w-4 h-4" />
            <span>{getCurrentDate()}</span>
          </div>
          
          {/* Sync Status Indicator */}
          <SyncStatusIndicator />
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLanguageToggle}
            className="relative group"
            title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
          >
            <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -bottom-0.5 -right-0.5 text-[10px] font-semibold px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 uppercase">
              {language}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="relative group"
            title={theme === 'light' ? (language === 'en' ? 'Dark mode' : 'Mode sombre') : (language === 'en' ? 'Light mode' : 'Mode clair')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:rotate-12" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500 transition-transform group-hover:rotate-45" />
            )}
          </Button>

          {/* Mobile Sync Status */}
          <div className="flex md:hidden items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-gray-400" />
            )}
            {syncQueueCount > 0 && (
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                {syncQueueCount}
              </Badge>
            )}
          </div>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex gap-2"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm text-gray-600">Search...</span>
            <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 text-xs text-gray-600">
              ⌘K
            </kbd>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {(syncQueueCount > 0 || !isOnline) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {syncQueueCount > 0 && (
                <div className="px-2 py-3 text-sm">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>{syncQueueCount} transactions pending sync</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Will sync when connection is restored
                  </p>
                </div>
              )}
              {!isOnline && (
                <div className="px-2 py-3 text-sm">
                  <div className="flex items-center gap-2 text-orange-700">
                    <WifiOff className="w-4 h-4" />
                    <span>Working offline</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your data is safe and will sync automatically
                  </p>
                </div>
              )}
              {isOnline && syncQueueCount === 0 && (
                <div className="px-2 py-3 text-sm text-gray-500 text-center">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <div className="text-sm text-gray-900 dark:text-white leading-none">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1">
                    {user?.email || appUser?.businessName || 'Shop Owner'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.email || 'user@example.com'}
                  </p>
                  {appUser?.businessName && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      {appUser.businessName}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}