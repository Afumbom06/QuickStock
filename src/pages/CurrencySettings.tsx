import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  DollarSign, 
  Check, 
  AlertTriangle, 
  Globe,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Wallet,
  Info,
  CheckCircle2,
  Search,
  Star,
  Sparkles,
  BarChart3,
  Receipt,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';

const CURRENCIES = [
  {
    code: 'XAF',
    name: 'Central African CFA Franc',
    symbol: 'FCFA',
    country: 'Cameroon, Chad, CAR, Congo, Gabon, Equatorial Guinea',
    flag: '🇨🇲',
    sampleAmount: 3500,
    popular: true,
    region: 'Central Africa',
  },
  {
    code: 'XOF',
    name: 'West African CFA Franc',
    symbol: 'FCFA',
    country: 'Senegal, Ivory Coast, Benin, Burkina Faso, Mali, Niger, Togo',
    flag: '🇸🇳',
    sampleAmount: 3500,
    popular: true,
    region: 'West Africa',
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    country: 'Nigeria',
    flag: '🇳🇬',
    sampleAmount: 1500,
    popular: true,
    region: 'West Africa',
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    country: 'Ghana',
    flag: '🇬🇭',
    sampleAmount: 45,
    popular: true,
    region: 'West Africa',
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    country: 'Kenya',
    flag: '🇰🇪',
    sampleAmount: 120,
    popular: false,
    region: 'East Africa',
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    country: 'Uganda',
    flag: '🇺🇬',
    sampleAmount: 3800,
    popular: false,
    region: 'East Africa',
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    country: 'Tanzania',
    flag: '🇹🇿',
    sampleAmount: 2350,
    popular: false,
    region: 'East Africa',
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    country: 'South Africa',
    flag: '🇿🇦',
    sampleAmount: 18,
    popular: false,
    region: 'Southern Africa',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    country: 'United States',
    flag: '🇺🇸',
    sampleAmount: 35,
    popular: false,
    region: 'International',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    country: 'European Union',
    flag: '🇪🇺',
    sampleAmount: 32,
    popular: false,
    region: 'International',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    country: 'United Kingdom',
    flag: '🇬🇧',
    sampleAmount: 28,
    popular: false,
    region: 'International',
  },
];

export function CurrencySettings() {
  const { user, setUser, isOnline } = useApp();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || 'XAF');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formatPreview = (amount: number, currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (!currency) return `${amount}`;
    
    // Format with proper separators
    const formatted = amount.toLocaleString('fr-FR');
    return `${formatted} ${currency.code}`;
  };

  const handleSave = async () => {
    if (!user) return;

    if (selectedCurrency === user.currency) {
      toast.info('Currency is already set to ' + selectedCurrency);
      navigate('/settings');
      return;
    }

    setLoading(true);
    try {
      await setUser({
        ...user,
        currency: selectedCurrency,
      });

      toast.success('Currency updated successfully!', {
        description: `All amounts will now display in ${selectedCurrency}`,
      });

      // Navigate back after short delay
      setTimeout(() => navigate('/settings'), 500);
    } catch (error) {
      toast.error('Failed to update currency');
    } finally {
      setLoading(false);
    }
  };

  const currentCurrency = CURRENCIES.find(c => c.code === user?.currency);
  const selectedCurrencyData = CURRENCIES.find(c => c.code === selectedCurrency);
  const hasChanges = selectedCurrency !== user?.currency;

  // Filter currencies by search
  const filteredCurrencies = CURRENCIES.filter(currency => 
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by region
  const popularCurrencies = filteredCurrencies.filter(c => c.popular);
  const otherCurrencies = filteredCurrencies.filter(c => !c.popular);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b"
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Currency Settings</h1>
                <p className="text-sm text-gray-600">Choose how amounts are displayed throughout the app</p>
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
                      <strong>Offline Mode</strong> - Currency change will sync when you're back online
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Currency */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-600" />
                      Current Currency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="text-6xl">{currentCurrency?.flag}</div>
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-1">{currentCurrency?.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{currentCurrency?.country}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white">
                            {currentCurrency?.code}
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            {currentCurrency?.region}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl text-green-600 mb-1">
                          {currentCurrency?.symbol}
                        </p>
                        <Badge className="bg-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, code, country, or region..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Popular Currencies */}
              {popularCurrencies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                        Popular in Africa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {popularCurrencies.map((currency, index) => (
                        <motion.div
                          key={currency.code}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            onClick={() => setSelectedCurrency(currency.code)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedCurrency === currency.code
                                ? 'border-green-600 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{currency.flag}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-gray-900">{currency.name}</h3>
                                  {selectedCurrency === currency.code && (
                                    <Check className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{currency.country}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {currency.region}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-2xl text-gray-900 mb-1">{currency.symbol}</p>
                                <p className="text-xs text-gray-500">{currency.code}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Other Currencies */}
              {otherCurrencies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Other Currencies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {otherCurrencies.map((currency, index) => (
                        <motion.div
                          key={currency.code}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            onClick={() => setSelectedCurrency(currency.code)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedCurrency === currency.code
                                ? 'border-green-600 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{currency.flag}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-gray-900">{currency.name}</h3>
                                  {selectedCurrency === currency.code && (
                                    <Check className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{currency.country}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {currency.region}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-2xl text-gray-900 mb-1">{currency.symbol}</p>
                                <p className="text-xs text-gray-500">{currency.code}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* No Results */}
              {filteredCurrencies.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No currencies found matching "{searchQuery}"</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Preview Card */}
              {selectedCurrencyData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="sticky top-6"
                >
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-green-600" />
                        Format Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Selected Currency Display */}
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                        <div className="text-5xl mb-2">{selectedCurrencyData.flag}</div>
                        <h3 className="text-lg text-gray-900 mb-1">{selectedCurrencyData.name}</h3>
                        <Badge variant="outline" className="bg-white">
                          {selectedCurrencyData.code}
                        </Badge>
                      </div>

                      {/* Amount Previews */}
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingCart className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-gray-600">Sale Amount</span>
                          </div>
                          <p className="text-lg text-gray-900">
                            {formatPreview(selectedCurrencyData.sampleAmount, selectedCurrency)}
                          </p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-gray-600">Large Amount</span>
                          </div>
                          <p className="text-lg text-gray-900">
                            {formatPreview(selectedCurrencyData.sampleAmount * 100, selectedCurrency)}
                          </p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-gray-600">Small Amount</span>
                          </div>
                          <p className="text-lg text-gray-900">
                            {formatPreview(Math.floor(selectedCurrencyData.sampleAmount / 10), selectedCurrency)}
                          </p>
                        </div>
                      </div>

                      {/* Where it appears */}
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-600 mb-2">This format will appear in:</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Receipt className="w-3 h-3 text-blue-600" />
                            Sales & Receipts
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Package className="w-3 h-3 text-orange-600" />
                            Inventory & Products
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <CreditCard className="w-3 h-3 text-green-600" />
                            Expenses & Payments
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <BarChart3 className="w-3 h-3 text-purple-600" />
                            Reports & Analytics
                          </div>
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
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-blue-900">
                          <strong>Important Note:</strong>
                        </p>
                        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                          <li>Changes display format only</li>
                          <li>Does not convert existing values</li>
                          <li>Updates all amounts instantly</li>
                          <li>Works offline with sync</li>
                        </ul>
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
              className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Currency
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
