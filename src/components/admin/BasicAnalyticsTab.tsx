import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatsGrid } from './StatsGrid';
import { OfflineIndicatorBanner } from './OfflineIndicatorBanner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function BasicAnalyticsTab() {
  const { sales, expenses, inventory, customers, isOnline } = useApp();
  const { user } = useAuth();

  // Calculate all-time stats
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const totalItems = inventory.length;
  const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockAlert).length;
  const debtCustomersCount = customers.filter(c => c.totalDebt > 0).length;

  const currency = user?.currency || 'XAF';

  // Monthly trend data (last 6 months)
  const getMonthlyTrend = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
      
      const monthlySales = sales
        .filter(s => s.date.startsWith(monthStr))
        .reduce((sum, s) => sum + s.total, 0);
      
      const monthlyExpenses = expenses
        .filter(e => e.date.startsWith(monthStr))
        .reduce((sum, e) => sum + e.amount, 0);
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthlySales,
        expenses: monthlyExpenses,
        profit: monthlySales - monthlyExpenses,
      });
    }
    return months;
  };

  const monthlyTrend = getMonthlyTrend();

  const handleRefresh = async () => {
    if (!isOnline) {
      toast.error('You are offline. Connect to internet to refresh.');
      return;
    }
    
    toast.success('Analytics refreshed');
  };

  return (
    <div className="space-y-6">
      <OfflineIndicatorBanner isOnline={isOnline} message="Viewing cached analytics data. Reconnect to refresh." />

      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl text-gray-900">Business Analytics</h2>
          <p className="text-gray-600 mt-1">All-time performance overview</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={!isOnline}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <StatsGrid
        totalSales={totalSales}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        totalItems={totalItems}
        lowStockCount={lowStockCount}
        debtCustomersCount={debtCustomersCount}
        currency={currency}
        isOffline={!isOnline}
      />

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Sales vs Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `${currency} ${value.toLocaleString()}`}
                  />
                  <Bar dataKey="sales" fill="#10b981" name="Sales" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profit Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `${currency} ${value.toLocaleString()}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                {netProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-900">Overall Performance</p>
                <p className="text-xs text-gray-500 mt-1">
                  {netProfit >= 0 
                    ? `Your business is profitable with a net profit of ${currency} ${netProfit.toLocaleString()}`
                    : `Your expenses exceed sales by ${currency} ${Math.abs(netProfit).toLocaleString()}`
                  }
                </p>
              </div>
            </div>

            {lowStockCount > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Inventory Alert</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {lowStockCount} {lowStockCount === 1 ? 'item is' : 'items are'} running low on stock. Consider restocking soon.
                  </p>
                </div>
              </div>
            )}

            {debtCustomersCount > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Outstanding Debts</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {debtCustomersCount} {debtCustomersCount === 1 ? 'customer has' : 'customers have'} outstanding debts. Follow up for collections.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
