import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Globe, 
  Check, 
  AlertTriangle,
  Shield,
  Clock,
  Calendar,
  Phone,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Info,
  Languages,
  MapPin,
  Building2,
  Badge as BadgeIcon,
  Star
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';

const LANGUAGES = [
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇬🇧', 
    nativeName: 'English',
    description: 'International business language',
    region: 'Global'
  },
  { 
    code: 'fr', 
    name: 'French', 
    flag: '🇫🇷', 
    nativeName: 'Français',
    description: 'Official language of Cameroon',
    region: 'Central Africa'
  },
];

export function AccountSettings() {
  const { user: appUser, setUser, changeLanguage, isOnline } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    email: appUser?.email || '',
    language: appUser?.language || 'en',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!appUser) return;

    // Validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format');
      return;
    }

    setLoading(true);
    try {
      // Update language if changed
      if (formData.language !== appUser.language) {
        changeLanguage(formData.language as 'en' | 'fr');
      }

      // Update email
      await setUser({
        ...appUser,
        email: formData.email,
      });

      toast.success('Account settings updated!', {
        description: isOnline ? 'Changes saved and synced' : '⚠️ Will sync when online',
      });

      setHasChanges(false);
      setTimeout(() => navigate('/settings'), 500);
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const currentLanguage = LANGUAGES.find(l => l.code === formData.language);
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-pink-50 to-rose-50 border-b"
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
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-600">Manage your profile and preferences</p>
              </div>
            </div>
            {hasChanges && (
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 gap-2">
                <AlertTriangle className="w-3 h-3" />
                Unsaved
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6 pb-24">
          {/* Offline Warning */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-orange-300 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <p className="text-sm text-orange-900">
                      <strong>Offline Mode</strong> - Changes will sync when you're back online
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Overview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-600" />
                      Profile Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center text-white text-4xl border-4 border-white shadow-lg flex-shrink-0">
                        {appUser?.shopName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl text-gray-900 mb-2">
                          {appUser?.shopName || user?.shopName || 'My Shop'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                          {user?.name && (
                            <Badge variant="outline" className="bg-white gap-1">
                              <User className="w-3 h-3" />
                              {user.name}
                            </Badge>
                          )}
                          {isAdmin && (
                            <Badge className="bg-purple-600 gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-white gap-1">
                            <DollarSign className="w-3 h-3" />
                            {appUser?.currency || 'XAF'}
                          </Badge>
                          <Badge variant="outline" className="bg-white gap-1">
                            <Globe className="w-3 h-3" />
                            {currentLanguage?.nativeName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Used for receipts, notifications, and account recovery
                      </p>
                    </div>

                    {/* Shop Name (Read-only) */}
                    <div>
                      <Label className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        Shop Name
                      </Label>
                      <Input
                        value={appUser?.shopName || 'Not set'}
                        disabled
                        className="mt-2 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Edit in Shop Information settings
                      </p>
                    </div>

                    {/* Phone (Read-only) */}
                    <div>
                      <Label className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        value={appUser?.phone || 'Not set'}
                        disabled
                        className="mt-2 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Edit in Shop Information settings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Language Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-green-600" />
                      Language Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Language Display */}
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="text-6xl">{currentLanguage?.flag}</div>
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-1">{currentLanguage?.nativeName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{currentLanguage?.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white">
                            {currentLanguage?.name}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {currentLanguage?.region}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    {/* Language Selector */}
                    <div>
                      <Label htmlFor="language" className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Select Language
                      </Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleInputChange('language', value)}
                      >
                        <SelectTrigger id="language" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{lang.flag}</span>
                                <div>
                                  <p>{lang.nativeName}</p>
                                  <p className="text-xs text-gray-500">{lang.name}</p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        App interface will update immediately to selected language
                      </p>
                    </div>

                    {/* What Changes */}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-600 mb-2">Language changes will affect:</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          All menus and buttons
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Dashboard labels
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Form fields
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Error messages
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Account Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-6"
              >
                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BadgeIcon className="w-5 h-5 text-pink-600" />
                      Account Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Role */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Account Type</span>
                      </div>
                      <Badge className={isAdmin ? 'bg-purple-600' : 'bg-blue-600'}>
                        {isAdmin ? 'Admin' : 'User'}
                      </Badge>
                    </div>

                    {/* Currency */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Currency</span>
                      </div>
                      <Badge variant="outline">
                        {appUser?.currency || 'XAF'}
                      </Badge>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Language</span>
                      </div>
                      <Badge variant="outline">
                        {currentLanguage?.flag} {currentLanguage?.nativeName}
                      </Badge>
                    </div>

                    {/* Member Since */}
                    {user?.createdAt && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-gray-600">Member Since</span>
                        </div>
                        <span className="text-xs text-gray-700">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {/* Location */}
                    {appUser?.address && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">Location</span>
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {appUser.address}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => navigate('/settings/shop-info')}
                    >
                      <Building2 className="w-4 h-4" />
                      Edit Shop Info
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => navigate('/settings/currency')}
                    >
                      <DollarSign className="w-4 h-4" />
                      Change Currency
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => navigate('/profile')}
                    >
                      <User className="w-4 h-4" />
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-blue-900">
                          <strong>Privacy Note:</strong>
                        </p>
                        <p className="text-xs text-blue-800">
                          Your data is stored locally on your device. We don't collect or share your personal information.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3 sticky bottom-6 bg-white p-4 rounded-lg shadow-lg border"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="flex-1 gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
