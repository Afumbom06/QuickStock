import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { BranchStats } from '../../utils/types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function BranchAnalyticsTab() {
  // Mock data - in real implementation, this would come from context/API
  const branchStats: BranchStats[] = useMemo(() => [
    {
      branchId: '1',
      branchName: 'Main Branch',
      totalSales: 1250000,
      totalExpenses: 450000,
      netProfit: 800000,
      inventoryValue: 350000,
      lowStockItems: 5,
      totalCustomers: 145,
      totalDebt: 125000,
      salesCount: 234,
      topSellingItem: {
        name: 'Rice 50kg',
        quantity: 120,
      },
    },
    {
      branchId: '2',
      branchName: 'Downtown Branch',
      totalSales: 980000,
      totalExpenses: 380000,
      netProfit: 600000,
      inventoryValue: 280000,
      lowStockItems: 3,
      totalCustomers: 98,
      totalDebt: 87000,
      salesCount: 187,
      topSellingItem: {
        name: 'Cooking Oil 5L',
        quantity: 95,
      },
    },
    {
      branchId: '3',
      branchName: 'Market Branch',
      totalSales: 1450000,
      totalExpenses: 520000,
      netProfit: 930000,
      inventoryValue: 420000,
      lowStockItems: 8,
      totalCustomers: 203,
      totalDebt: 156000,
      salesCount: 312,
      topSellingItem: {
        name: 'Sugar 1kg',
        quantity: 150,
      },
    },
  ], []);

  const totalStats = useMemo(() => {
    return branchStats.reduce((acc, branch) => ({
      totalSales: acc.totalSales + branch.totalSales,
      totalExpenses: acc.totalExpenses + branch.totalExpenses,
      netProfit: acc.netProfit + branch.netProfit,
      inventoryValue: acc.inventoryValue + branch.inventoryValue,
      lowStockItems: acc.lowStockItems + branch.lowStockItems,
      totalCustomers: acc.totalCustomers + branch.totalCustomers,
      totalDebt: acc.totalDebt + branch.totalDebt,
      salesCount: acc.salesCount + branch.salesCount,
    }), {
      totalSales: 0,
      totalExpenses: 0,
      netProfit: 0,
      inventoryValue: 0,
      lowStockItems: 0,
      totalCustomers: 0,
      totalDebt: 0,
      salesCount: 0,
    });
  }, [branchStats]);

  const topBranch = useMemo(() => {
    return [...branchStats].sort((a, b) => b.netProfit - a.netProfit)[0];
  }, [branchStats]);

  const chartData = branchStats.map(branch => ({
    name: branch.branchName.replace(' Branch', ''),
    sales: branch.totalSales / 1000,
    expenses: branch.totalExpenses / 1000,
    profit: branch.netProfit / 1000,
  }));

  const pieData = branchStats.map(branch => ({
    name: branch.branchName,
    value: branch.totalSales,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-2xl text-gray-900">Branch Analytics</h2>
        <p className="text-gray-600 mt-1">
          Comparing performance across {branchStats.length} branches
        </p>
      </motion.div>

      {/* Overall Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl text-gray-900 mt-1">
                    {(totalStats.totalSales / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-1">XAF</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl text-gray-900 mt-1">
                    {(totalStats.totalExpenses / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-1">XAF</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Net Profit</p>
                  <p className="text-2xl text-gray-900 mt-1">
                    {(totalStats.netProfit / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-1">XAF</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl text-gray-900 mt-1">
                    {totalStats.totalCustomers}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Across all branches</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Branch Highlight */}
      {topBranch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg text-gray-900">Top Performing Branch</h3>
                    <Badge className="bg-blue-600">Best Profit</Badge>
                  </div>
                  <p className="text-2xl text-blue-600">{topBranch.branchName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Net Profit: {(topBranch.netProfit / 1000).toFixed(0)}K XAF • 
                    Sales: {topBranch.salesCount} transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Branch Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" name="Sales (K)" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses (K)" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit (K)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Branch Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branchStats.map((branch, index) => (
          <motion.div
            key={branch.branchId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">{branch.branchName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Sales</p>
                    <p className="text-lg text-green-600">
                      {(branch.totalSales / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Profit</p>
                    <p className="text-lg text-blue-600">
                      {(branch.netProfit / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Customers</p>
                    <p className="text-lg text-gray-900">
                      {branch.totalCustomers}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Transactions</p>
                    <p className="text-lg text-gray-900">
                      {branch.salesCount}
                    </p>
                  </div>
                </div>
                
                {branch.lowStockItems > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      {branch.lowStockItems} low stock items
                    </div>
                  </div>
                )}

                {branch.topSellingItem && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-600 mb-1">Top Selling</p>
                    <p className="text-sm text-gray-900">
                      {branch.topSellingItem.name} ({branch.topSellingItem.quantity} units)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
