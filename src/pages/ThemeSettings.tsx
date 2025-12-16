import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Palette, 
  Check, 
  Sun, 
  Moon, 
  Monitor, 
  AlertTriangle,
  Sparkles,
  Eye,
  Zap,
  Star,
  Clock,
  Info,
  CheckCircle2,
  Layout,
  Smartphone,
  Laptop,
  Contrast
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';

const THEMES = [
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean and bright interface perfect for daytime use',
    fullDescription: 'A crisp, clean interface optimized for well-lit environments. Reduces eye strain during the day and provides excellent contrast for reading.',
    icon: Sun,
    previewBg: 'bg-white',
    previewText: 'text-gray-900',
    previewAccent: 'bg-blue-600',
    gradient: 'from-yellow-100 to-orange-100',
    available: true,
    recommended: true,
    benefits: [
      'Better readability in bright environments',
      'Professional appearance',
      'Lower battery consumption on LCD screens',
      'Familiar design pattern'
    ]
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes in low light conditions',
    fullDescription: 'A sophisticated dark interface that reduces eye strain in low-light environments and saves battery on OLED screens.',
    icon: Moon,
    previewBg: 'bg-gray-900',
    previewText: 'text-white',
    previewAccent: 'bg-blue-500',
    gradient: 'from-gray-800 to-blue-900',
    available: false,
    recommended: false,
    benefits: [
      'Reduced eye strain at night',
      'Better for OLED battery life',
      'Modern aesthetic',
      'Less blue light emission'
    ]
  },
  {
    id: 'system',
    name: 'System Default',
    description: 'Automatically match your device settings',
    fullDescription: 'Intelligently switches between light and dark modes based on your device\'s system preferences and time of day.',
    icon: Monitor,
    previewBg: 'bg-gradient-to-br from-white to-gray-900',
    previewText: 'text-gray-600',
    previewAccent: 'bg-blue-600',
    gradient: 'from-purple-100 to-blue-100',
    available: false,
    recommended: false,
    benefits: [
      'Automatic theme switching',
      'Matches device preferences',
      'Best of both worlds',
      'Seamless experience'
    ]
  },
];

export function ThemeSettings() {
  const { user, setUser, isOnline } = useApp();
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'light');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    const theme = THEMES.find(t => t.id === selectedTheme);
    
    if (!theme?.available) {
      toast.info('This theme is coming soon!', {
        description: 'We\'re working on it. Stay tuned!',
      });
      return;
    }

    if (selectedTheme === user.theme) {
      toast.info('Theme is already set to ' + theme.name);
      navigate('/settings');
      return;
    }

    setLoading(true);
    try {
      await setUser({
        ...user,
        theme: selectedTheme as 'light' | 'dark',
      });

      toast.success('Theme updated successfully!', {
        description: `Switched to ${theme.name}`,
      });

      // Navigate back after short delay
      setTimeout(() => navigate('/settings'), 500);
    } catch (error) {
      toast.error('Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = THEMES.find(t => t.id === user?.theme);
  const selectedThemeData = THEMES.find(t => t.id === selectedTheme);
  const CurrentIcon = currentTheme?.icon || Sun;
  const hasChanges = selectedTheme !== user?.theme;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-purple-50 to-pink-50 border-b"
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Theme Mode</h1>
                <p className="text-sm text-gray-600">Customize the look and feel of your app</p>
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
                      <strong>Offline Mode</strong> - Theme changes work offline and will sync later
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Theme */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CurrentIcon className="w-5 h-5 text-purple-600" />
                      Current Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex items-center gap-4 p-6 bg-gradient-to-br ${currentTheme?.gradient} rounded-xl border-2 border-purple-200`}>
                      <div className={`w-20 h-20 ${currentTheme?.previewBg} rounded-2xl border-4 border-white shadow-lg flex items-center justify-center`}>
                        <CurrentIcon className={`w-10 h-10 ${currentTheme?.id === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-1">{currentTheme?.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{currentTheme?.description}</p>
                        <Badge className="bg-purple-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Theme Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Choose Your Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {THEMES.map((theme, index) => {
                      const ThemeIcon = theme.icon;
                      return (
                        <motion.div
                          key={theme.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          whileTap={{ scale: theme.available ? 0.98 : 1 }}
                        >
                          <div
                            onClick={() => theme.available && setSelectedTheme(theme.id)}
                            className={`relative p-5 rounded-xl border-2 transition-all ${
                              theme.available
                                ? selectedTheme === theme.id
                                  ? 'border-purple-600 bg-purple-50 cursor-pointer shadow-md'
                                  : 'border-gray-200 hover:border-purple-300 cursor-pointer hover:bg-gray-50'
                                : 'border-gray-200 opacity-60 cursor-not-allowed bg-gray-50'
                            }`}
                          >
                            {/* Coming Soon Badge */}
                            {!theme.available && (
                              <div className="absolute top-3 right-3 z-10">
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Coming Soon
                                </Badge>
                              </div>
                            )}

                            {/* Recommended Badge */}
                            {theme.recommended && (
                              <div className="absolute top-3 right-3 z-10">
                                <Badge className="bg-green-600 gap-1">
                                  <Star className="w-3 h-3 fill-white" />
                                  Recommended
                                </Badge>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-5">
                              {/* Theme Preview */}
                              <div className={`w-24 h-24 ${theme.previewBg} rounded-2xl border-4 border-gray-300 flex items-center justify-center shadow-lg overflow-hidden relative flex-shrink-0`}>
                                <ThemeIcon className={`w-12 h-12 ${theme.id === 'dark' ? 'text-white' : theme.id === 'system' ? 'text-gray-600' : 'text-gray-900'}`} />
                                {/* Accent bar */}
                                <div className={`absolute bottom-0 left-0 right-0 h-3 ${theme.previewAccent}`} />
                              </div>

                              {/* Theme Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg text-gray-900">{theme.name}</h3>
                                  {selectedTheme === theme.id && theme.available && (
                                    <Check className="w-5 h-5 text-purple-600" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{theme.fullDescription}</p>
                                
                                {/* Benefits */}
                                <div className="grid grid-cols-2 gap-2">
                                  {theme.benefits.slice(0, 2).map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span>{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Device Compatibility */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layout className="w-5 h-5 text-blue-600" />
                      Works Everywhere
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-900">Mobile</p>
                        <p className="text-xs text-gray-600">iOS & Android</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <Monitor className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-900">Desktop</p>
                        <p className="text-xs text-gray-600">All browsers</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <Laptop className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-900">Tablet</p>
                        <p className="text-xs text-gray-600">iPad & more</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Live Preview */}
              {selectedThemeData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="sticky top-6"
                >
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-600" />
                        Live Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Theme Icon Display */}
                      <div className={`text-center p-6 bg-gradient-to-br ${selectedThemeData.gradient} rounded-xl border-2 border-purple-200`}>
                        <div className={`w-20 h-20 ${selectedThemeData.previewBg} rounded-2xl border-4 border-white shadow-lg flex items-center justify-center mx-auto mb-3`}>
                          <selectedThemeData.icon className={`w-10 h-10 ${selectedThemeData.id === 'dark' ? 'text-white' : selectedThemeData.id === 'system' ? 'text-gray-600' : 'text-gray-900'}`} />
                        </div>
                        <h3 className="text-lg text-gray-900 mb-1">{selectedThemeData.name}</h3>
                        <Badge variant="outline" className="bg-white">
                          {selectedTheme === user?.theme ? 'Current' : 'Preview'}
                        </Badge>
                      </div>

                      {/* Sample Card Preview */}
                      <div className="space-y-3">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Contrast className="w-3 h-3" />
                          How your app will look:
                        </p>
                        
                        <div className={`p-4 rounded-xl border-2 ${
                          selectedTheme === 'dark' 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <h4 className={`mb-2 ${
                            selectedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Dashboard Card
                          </h4>
                          <p className={`text-sm mb-3 ${
                            selectedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Sample content preview
                          </p>
                          <div className="flex gap-2">
                            <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                              Primary
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg text-sm ${
                              selectedTheme === 'dark'
                                ? 'bg-gray-700 text-gray-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              Secondary
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Benefits List */}
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-600 mb-2">Key Benefits:</p>
                        <div className="space-y-2">
                          {selectedThemeData.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-blue-900">
                          <strong>Coming Soon:</strong>
                        </p>
                        <p className="text-xs text-blue-800">
                          Dark mode and system default themes are under development. 
                          We'll notify you when they're ready!
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
            transition={{ delay: 0.6 }}
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
              className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply Theme
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
