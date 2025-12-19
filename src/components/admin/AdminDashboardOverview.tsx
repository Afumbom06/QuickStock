import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingCart,
  CreditCard,
  UserCheck,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
  Target,
  Zap,
  Bell,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboardOverview() {
  // Mock data - in production, this would come from context/API
  const stats = useMemo(() => ({
    totalBranches: 3,
    activeBranches: 3,
    totalStaff: 12,
    activeStaff: 11,
    todaySales: 450000,
    todayExpenses: 125000,
    todayProfit: 325000,
    totalInventoryValue: 1050000,
    lowStockItems: 16,
    totalCustomers: 446,
    outstandingDebt: 368000,
    todayTransactions: 47,
    salesGrowth: 12.5,
    profitGrowth: 8.3,
    revenueGrowth: 15.2,
  }), []);

  const weeklyData = useMemo(() => [
    { day: 'Mon', sales: 380, expenses: 120, profit: 260 },
    { day: 'Tue', sales: 420, expenses: 140, profit: 280 },
    { day: 'Wed', sales: 350, expenses: 110, profit: 240 },
    { day: 'Thu', sales: 480, expenses: 150, profit: 330 },
    { day: 'Fri', sales: 520, expenses: 160, profit: 360 },
    { day: 'Sat', sales: 600, expenses: 180, profit: 420 },
    { day: 'Sun', sales: 450, expenses: 125, profit: 325 },
  ], []);

  const topBranches = useMemo(() => [
    { name: 'Market Branch', sales: 1450000, profit: 930000, growth: 15.2 },
    { name: 'Main Branch', sales: 1250000, profit: 800000, growth: 12.8 },
    { name: 'Downtown Branch', sales: 980000, profit: 600000, growth: 8.5 },
  ], []);

  const alerts = useMemo(() => [
    {
      id: '1',
      type: 'warning',
      title: '16 items low on stock',
      description: 'Restock needed across 3 branches',
      icon: Package,
      color: 'orange',
    },
    {
      id: '2',
      type: 'info',
      title: 'Outstanding debt: 368K XAF',
      description: 'Follow up with 23 customers',
      icon: CreditCard,
      color: 'blue',
    },
    {
      id: '3',
      type: 'success',
      title: 'Sales up 12.5%',
      description: 'Compared to last week',
      icon: TrendingUp,
      color: 'green',
    },
  ], []);

  const recentActivity = useMemo(() => [
    {
      id: '1',
      action: 'New branch created',
      detail: 'Market Branch by Admin',
      time: '2 hours ago',
      icon: Building2,
      color: 'blue',
    },
    {
      id: '2',
      action: 'Staff member added',
      detail: 'Sarah Manager to Main Branch',
      time: '4 hours ago',
      icon: UserCheck,
      color: 'purple',
    },
    {
      id: '3',
      action: 'Large expense recorded',
      detail: '75,000 XAF - Rent payment',
      time: '6 hours ago',
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      id: '4',
      action: 'Settings updated',
      detail: 'Tax rate changed to 5%',
      time: '1 day ago',
      icon: Activity,
      color: 'gray',
    },
  ], []);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl text-gray-900">Welcome Back, Admin! </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="outline" className="gap-1">
                  <Target className="w-3 h-3" />
                  {stats.activeBranches} Active
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Total Branches</p>
              <p className="text-3xl text-gray-900 mt-1">{stats.totalBranches}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="outline" className="gap-1">
                  <UserCheck className="w-3 h-3" />
                  {stats.activeStaff} Active
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-3xl text-gray-900 mt-1">{stats.totalStaff}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-600 gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{stats.salesGrowth}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Today's Sales</p>
              <p className="text-3xl text-gray-900 mt-1">
                {(stats.todaySales / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">XAF</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <Badge className="bg-orange-600 gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{stats.profitGrowth}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Today's Profit</p>
              <p className="text-3xl text-gray-900 mt-1">
                {(stats.todayProfit / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">XAF</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-xl text-gray-900">{stats.todayTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  <p className="text-xl text-gray-900">
                    {(stats.totalInventoryValue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-xl text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-xl text-gray-900">{stats.lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="w-5 h-5 text-orange-600" />
              Important Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                const colorClasses = {
                  orange: 'bg-orange-100 text-orange-700 border-orange-200',
                  blue: 'bg-blue-100 text-blue-700 border-blue-200',
                  green: 'bg-green-100 text-green-700 border-green-200',
                };
                
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${colorClasses[alert.color as keyof typeof colorClasses]}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{alert.title}</p>
                        <p className="text-xs opacity-75 mt-1">{alert.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorSales)"
                    name="Sales (K)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorProfit)"
                    name="Profit (K)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Branches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Top Performing Branches</CardTitle>
              <Button variant="ghost" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {topBranches.map((branch, index) => (
                <motion.div
                  key={branch.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {index === 0 ? <Award className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-900 truncate">{branch.name}</p>
                      <Badge className="bg-green-600 gap-1 flex-shrink-0 ml-2">
                        <ArrowUpRight className="w-3 h-3" />
                        +{branch.growth}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Sales: {(branch.sales / 1000).toFixed(0)}K</span>
                      <span>Profit: {(branch.profit / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2">
              <Activity className="w-4 h-4" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-600',
                  purple: 'bg-purple-100 text-purple-600',
                  orange: 'bg-orange-100 text-orange-600',
                  gray: 'bg-gray-100 text-gray-600',
                };
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{activity.detail}</p>
                    </div>
                    <p className="text-xs text-gray-500 flex-shrink-0">{activity.time}</p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Add Branch</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Users className="w-4 h-4" />
                <span className="text-sm">Add Staff</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">View Analytics</span>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Activity className="w-4 h-4" />
                <span className="text-sm">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
