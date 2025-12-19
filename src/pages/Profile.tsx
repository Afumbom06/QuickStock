import { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { 
  User, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  RefreshCw,
  Camera,
  Edit,
  LogOut,
  Key,
  Check,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function Profile() {
  const { user, setUser, isOnline } = useApp();
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    shopName: user?.shopName || '',
    ownerName: user?.ownerName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!formData.shopName.trim()) {
      toast.error('Shop name is required');
      return;
    }

    setLoading(true);
    try {
      await setUser({
        ...user,
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        logo: logoPreview || user.logo,
      });

      toast.success('Profile updated successfully!', {
        description: isOnline ? 'Changes saved and synced' : '⚠️ Will sync when online',
      });

      setEditModalOpen(false);
      setLogoPreview(null);
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password changed successfully!');
      setPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getJoinDate = () => {
    // Get from localStorage or default
    const joinDate = localStorage.getItem('user-join-date') || new Date().toISOString();
    return format(new Date(joinDate), 'MMMM dd, yyyy');
  };

  const getLastSyncTime = () => {
    const lastSync = localStorage.getItem('lastSyncTime');
    if (!lastSync) return 'Never synced';
    return format(new Date(lastSync), 'MMM dd • h:mm a');
  };

  const currentLogo = user?.logo;
  const shopInitial = user?.shopName?.[0]?.toUpperCase() || 'S';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">My Profile</h1>
          <p className="text-gray-600">Manage your shop information and account</p>
        </div>
        <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-600' : ''}>
          {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {currentLogo ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                    <img src={currentLogo} alt="Shop logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl border-4 border-gray-200 shadow-lg">
                    {shopInitial}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl text-gray-900 mb-1">{user?.shopName || 'My Shop'}</h2>
                <p className="text-gray-600 mb-4">{user?.ownerName || 'Shop Owner'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.phone}
                    </div>
                  )}
                  {user?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {user.address}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined {getJoinDate()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setEditModalOpen(true)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPasswordModalOpen(true)}
                    className="gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sync Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Last Synced</span>
                <span className="text-sm text-gray-900">{getLastSyncTime()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Connection</span>
                <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-600' : ''}>
                  {isOnline ? '🟢 Online' : '⚪ Offline'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Data Storage</span>
                <span className="text-sm text-gray-900">IndexedDB</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-sm text-gray-900 font-mono">{authUser?.id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm text-gray-900">{authUser?.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Currency</span>
                <span className="text-sm text-gray-900">{user?.currency || 'XAF'}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your shop information and profile details. Changes will be saved locally.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Logo Upload */}
            <div className="flex flex-col items-center gap-3 pb-4 border-b">
              {logoPreview ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : currentLogo ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={currentLogo} alt="Current" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
                  {shopInitial}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Change Logo
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shopName">
                  Shop Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>

            {!isOnline && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-900">
                  You're offline. Changes will sync when you're back online.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Check className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your account security.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setPasswordModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Check className="w-4 h-4" />
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}