import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { ProfileCard } from './ProfileCard';
import { EditableAvatarUploader } from './EditableAvatarUploader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Edit, Lock, LogOut, Save } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { OfflineIndicatorBanner } from './OfflineIndicatorBanner';
import { SyncStatusBadge } from './SyncStatusBadge';

export function UserProfileTab() {
  const { user, logout } = useAuth();
  const { isOnline, syncQueueCount } = useApp();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    shopName: user?.shopName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const formatLastSync = () => {
    if (!user?.lastSync) return undefined;
    const date = new Date(user.lastSync);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatJoinDate = () => {
    if (!user?.createdAt) return undefined;
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSaveProfile = async () => {
    try {
      // Save to IndexedDB
      // In a real app, this would update the user in the database
      toast.success(isOnline ? 'Profile updated successfully' : 'Profile saved locally. Will sync when online.');
      setEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      // In a real app, this would call an API to change the password
      toast.success('Password changed successfully');
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-6">
      <OfflineIndicatorBanner isOnline={isOnline} />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <ProfileCard
            name={user?.name || 'User'}
            shopName={user?.shopName || 'My Shop'}
            email={user?.email}
            phone={user?.phone}
            avatar={user?.avatar}
            joinDate={formatJoinDate()}
            lastSync={formatLastSync()}
            isOnline={isOnline}
            role={user?.role || 'user'}
          />
        </div>

        {/* Actions Card */}
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Account Actions</CardTitle>
                  <SyncStatusBadge 
                    pendingCount={syncQueueCount} 
                    lastSync={formatLastSync()} 
                    isOnline={isOnline} 
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Edit Profile Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="flex justify-center">
                        <EditableAvatarUploader
                          currentAvatar={editForm.avatar}
                          onAvatarChange={(url) => setEditForm(prev => ({ ...prev, avatar: url }))}
                          name={editForm.name}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="shopName">Shop Name</Label>
                          <Input
                            id="shopName"
                            value={editForm.shopName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, shopName: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Change Password Dialog */}
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>Enter your current password and a new password to update your account.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleChangePassword}>
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Logout */}
                <Button 
                  className="w-full justify-start" 
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}