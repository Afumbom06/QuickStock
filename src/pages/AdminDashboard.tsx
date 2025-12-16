import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  LayoutDashboard,
  User, 
  BarChart3, 
  Activity, 
  Building2, 
  Users, 
  TrendingUp, 
  Settings 
} from 'lucide-react';
import { AdminDashboardOverview } from '../components/admin/AdminDashboardOverview';
import { UserProfileTab } from '../components/admin/UserProfileTab';
import { BasicAnalyticsTab } from '../components/admin/BasicAnalyticsTab';
import { ActivityOverviewTab } from '../components/admin/ActivityOverviewTab';
import { BranchManagementTab } from '../components/admin/BranchManagementTab';
import { StaffManagementTab } from '../components/admin/StaffManagementTab';
import { BranchAnalyticsTab } from '../components/admin/BranchAnalyticsTab';
import { SystemSettingsTab } from '../components/admin/SystemSettingsTab';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 pb-4 flex-shrink-0"
      >
        <h1 className="text-3xl text-gray-900 mb-2">Admin Control Center</h1>
        <p className="text-gray-600">Manage branches, staff, analytics, and system settings</p>
      </motion.div>

      <div className="flex-1 overflow-hidden flex flex-col px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-8 mb-4 flex-shrink-0">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Branches</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pb-6">
            <TabsContent value="dashboard" className="mt-0">
              <AdminDashboardOverview />
            </TabsContent>

            <TabsContent value="branches" className="mt-0">
              <BranchManagementTab />
            </TabsContent>

            <TabsContent value="staff" className="mt-0">
              <StaffManagementTab />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <BranchAnalyticsTab />
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <BasicAnalyticsTab />
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <ActivityOverviewTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SystemSettingsTab />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <UserProfileTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}