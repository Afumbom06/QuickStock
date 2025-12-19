import { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  User, 
  Phone, 
  MapPin, 
  Upload, 
  Check, 
  AlertTriangle, 
  Camera,
  Mail,
  Building2,
  Globe,
  Calendar,
  Clock,
  Image as ImageIcon,
  X,
  Info,
  Sparkles,
  CheckCircle2,
  FileText,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function ShopInfo() {
  const { user: appUser, setUser, isOnline } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    shopName: appUser?.shopName || '',
    ownerName: appUser?.ownerName || '',
    phone: appUser?.phone || '',
    address: appUser?.address || '',
    email: appUser?.email || '',
    category: appUser?.shopCategory || 'general',
    description: appUser?.description || '',
    website: appUser?.website || '',
    taxId: appUser?.taxId || '',
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setHasChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!appUser) return;

    // Validation
    if (!formData.shopName.trim()) {
      toast.error('Shop name is required');
      return;
    }

    if (formData.phone && !/^[\d\s+()-]+$/.test(formData.phone)) {
      toast.error('Invalid phone number format');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format');
      return;
    }

    setLoading(true);
    try {
      await setUser({
        ...appUser,
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        shopCategory: formData.category,
        description: formData.description,
        website: formData.website,
        taxId: formData.taxId,
        logo: logoPreview !== null ? logoPreview : appUser.logo,
      });

      toast.success('Shop info updated successfully!', {
        description: isOnline ? 'Changes saved and synced' : '⚠️ Will sync when online',
      });

      setHasChanges(false);

      // Navigate back after short delay
      setTimeout(() => navigate('/settings'), 500);
    } catch (error) {
      toast.error('Failed to save shop info');
    } finally {
      setLoading(false);
    }
  };

  if (!appUser) return null;

  const currentLogo = logoPreview !== null ? logoPreview : appUser.logo;
  const shopInitial = formData.shopName?.[0]?.toUpperCase() || 'S';

  const shopCategories = [
    { value: 'general', label: 'General Store' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion & Clothing' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'beauty', label: 'Beauty & Cosmetics' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b"
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Shop Information</h1>
                <p className="text-sm text-gray-600">Update your shop details and branding</p>
              </div>
            </div>
            {hasChanges && (
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 gap-2">
                <AlertTriangle className="w-3 h-3" />
                Unsaved Changes
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

          {/* Shop Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Shop Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Logo */}
                  <div className="relative flex-shrink-0">
                    {currentLogo ? (
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={currentLogo}
                          alt="Shop logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-5xl border-4 border-white shadow-lg">
                        {shopInitial}
                      </div>
                    )}
                    {logoPreview !== null && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600">
                        New
                      </Badge>
                    )}
                  </div>

                  {/* Shop Info Preview */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl text-gray-900 mb-2">
                      {formData.shopName || 'Your Shop Name'}
                    </h2>
                    <div className="space-y-1 text-sm text-gray-600">
                      {formData.ownerName && (
                        <p className="flex items-center gap-2 justify-center sm:justify-start">
                          <User className="w-4 h-4" />
                          {formData.ownerName}
                        </p>
                      )}
                      {formData.phone && (
                        <p className="flex items-center gap-2 justify-center sm:justify-start">
                          <Phone className="w-4 h-4" />
                          {formData.phone}
                        </p>
                      )}
                      {formData.email && (
                        <p className="flex items-center gap-2 justify-center sm:justify-start">
                          <Mail className="w-4 h-4" />
                          {formData.email}
                        </p>
                      )}
                      {formData.category && (
                        <Badge variant="outline" className="mt-2">
                          {shopCategories.find(c => c.value === formData.category)?.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Shop Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-indigo-600" />
                      Shop Logo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      {/* Logo Preview */}
                      <div className="relative">
                        {currentLogo ? (
                          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-lg">
                            <img
                              src={currentLogo}
                              alt="Shop logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-6xl border-4 border-gray-200 shadow-lg">
                            {shopInitial}
                          </div>
                        )}
                      </div>

                      {/* Upload Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2 flex-1"
                        >
                          <Upload className="w-4 h-4" />
                          {currentLogo ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                        {currentLogo && (
                          <Button
                            variant="outline"
                            onClick={handleRemoveLogo}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-center space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1 justify-center">
                          <ImageIcon className="w-3 h-3" />
                          Recommended: Square image, max 2MB
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG, or GIF format
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Business Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Shop Name */}
                    <div>
                      <Label htmlFor="shopName" className="flex items-center gap-1">
                        <Store className="w-4 h-4" />
                        Shop Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="shopName"
                        placeholder="e.g., John's Grocery Store"
                        value={formData.shopName}
                        onChange={(e) => handleInputChange('shopName', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Shop Category */}
                    <div>
                      <Label htmlFor="category" className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Shop Category
                      </Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {shopCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tax ID */}
                    <div>
                      <Label htmlFor="taxId" className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Tax ID / Business Number <span className="text-xs text-gray-500">(Optional)</span>
                      </Label>
                      <Input
                        id="taxId"
                        placeholder="e.g., CM123456789"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description" className="flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        Shop Description <span className="text-xs text-gray-500">(Optional)</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your shop..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Owner Name */}
                    <div>
                      <Label htmlFor="ownerName" className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Owner Name <span className="text-xs text-gray-500">(Optional)</span>
                      </Label>
                      <Input
                        id="ownerName"
                        placeholder="e.g., John Doe"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., +237 6 XX XX XX XX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email Address <span className="text-xs text-gray-500">(Optional)</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g., shop@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Website */}
                    <div>
                      <Label htmlFor="website" className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        Website <span className="text-xs text-gray-500">(Optional)</span>
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="e.g., https://myshop.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Shop Address */}
                    <div>
                      <Label htmlFor="address" className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Shop Address <span className="text-xs text-gray-500">(Optional)</span>
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="e.g., Quartier Bastos, Yaoundé, Cameroon"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Include street, neighborhood, city, and country
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Account Type:</span>
                      <Badge variant="outline">{user?.role === 'admin' ? 'Admin' : 'User'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Currency:</span>
                      <Badge variant="outline">{appUser?.currency || 'XAF'}</Badge>
                    </div>
                    {user?.createdAt && (
                      <div className="flex items-center justify-between">
                        <span>Member Since:</span>
                        <span className="text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
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
              disabled={loading || !formData.shopName.trim() || !hasChanges}
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-blue-900">
                      <strong>Where this information appears:</strong>
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>Printed receipts and invoices</li>
                      <li>Sales reports and documents</li>
                      <li>Customer communications</li>
                      <li>Your shop profile and branding</li>
                    </ul>
                    <p className="text-xs text-blue-700 mt-2">
                      💡 Keep your information accurate and up-to-date for professional communication!
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
