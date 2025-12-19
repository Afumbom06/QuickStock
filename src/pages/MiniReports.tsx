import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  Share2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { 
  PieChart as RechartsPie, 
  Pie, 
  Cell,
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

export function MiniReports() {
  const { sales, expenses, user, isOnline, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const currency = user?.currency || 'XAF';
  const today = new Date();
  const yesterday = subDays(today, 1);

  // Today vs Yesterday
  const comparison = useMemo(() => {
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const todaySales = sales.filter(s => {
      const d = new Date(s.date);
      return d >= todayStart && d <= todayEnd;
    });
    const yesterdaySales = sales.filter(s => {
      const d = new Date(s.date);
      return d >= yesterdayStart && d <= yesterdayEnd;
    });

    const todayExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= todayStart && d <= todayEnd;
    });
    const yesterdayExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= yesterdayStart && d <= yesterdayEnd;
    });

    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const yesterdayTotal = yesterdaySales.reduce((sum, s) => sum + s.total, 0);
    const todayExpensesTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const yesterdayExpensesTotal = yesterdayExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      today: { sales: todayTotal, expenses: todayExpensesTotal, profit: todayTotal - todayExpensesTotal },
      yesterday: { sales: yesterdayTotal, expenses: yesterdayExpensesTotal, profit: yesterdayTotal - yesterdayExpensesTotal },
      salesChange: yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0,
      expensesChange: yesterdayExpensesTotal > 0 ? ((todayExpensesTotal - yesterdayExpensesTotal) / yesterdayExpensesTotal) * 100 : 0,
    };
  }, [sales, expenses, today, yesterday]);

  // This Week vs Last Week
  const weekComparison = useMemo(() => {
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });

    const thisWeekSales = sales.filter(s => {
      const d = new Date(s.date);
      return d >= thisWeekStart && d <= thisWeekEnd;
    }).reduce((sum, s) => sum + s.total, 0);

    const lastWeekSales = sales.filter(s => {
      const d = new Date(s.date);
      return d >= lastWeekStart && d <= lastWeekEnd;
    }).reduce((sum, s) => sum + s.total, 0);

    const thisWeekExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= thisWeekStart && d <= thisWeekEnd;
    }).reduce((sum, e) => sum + e.amount, 0);

    const lastWeekExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d >= lastWeekStart && d <= lastWeekEnd;
    }).reduce((sum, e) => sum + e.amount, 0);

    return {
      thisWeek: { sales: thisWeekSales, expenses: thisWeekExpenses, profit: thisWeekSales - thisWeekExpenses },
      lastWeek: { sales: lastWeekSales, expenses: lastWeekExpenses, profit: lastWeekSales - lastWeekExpenses },
      salesChange: lastWeekSales > 0 ? ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100 : 0,
      expensesChange: lastWeekExpenses > 0 ? ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100 : 0,
    };
  }, [sales, expenses, today]);

  // Expense Categories
  const expenseCategories = useMemo(() => {
    const categories = new Map<string, number>();
    expenses.forEach(e => {
      const existing = categories.get(e.category) || 0;
      categories.set(e.category, existing + e.amount);
    });

    return Array.from(categories.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Top Selling Items (last 7 days)
  const topItems = useMemo(() => {
    const sevenDaysAgo = subDays(today, 7);
    const recentSales = sales.filter(s => new Date(s.date) >= sevenDaysAgo);

    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    recentSales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const existing = itemMap.get(item.itemId) || { name: item.name, quantity: 0, revenue: 0 };
          itemMap.set(item.itemId, {
            name: item.name,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity)
          });
        });
      }
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales, today]);

  // Daily Sales Trend (last 7 days)
  const dailyTrend = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const daySales = sales.filter(s => {
        const d = new Date(s.date);
        return d >= dayStart && d <= dayEnd;
      });

      data.push({
        day: format(day, 'EEE'),
        sales: daySales.reduce((sum, s) => sum + s.total, 0),
        count: daySales.length
      });
    }
    return data;
  }, [sales, today]);

  // Export CSV
  const exportSalesCSV = () => {
    const headers = ['Date', 'Customer', 'Amount', 'Payment Method', 'Status'];
    const rows = sales.map(s => [
      format(new Date(s.date), 'yyyy-MM-dd HH:mm'),
      s.customerName || 'Walk-in',
      s.total.toString(),
      s.paymentMethod,
      s.synced ? 'Synced' : 'Pending'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${format(today, 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Sales report exported!');
  };

  const exportExpensesCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount', 'Status'];
    const rows = expenses.map(e => [
      format(new Date(e.date), 'yyyy-MM-dd HH:mm'),
      e.category,
      e.description || '',
      e.amount.toString(),
      e.synced ? 'Synced' : 'Pending'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${format(today, 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Expenses report exported!');
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1 flex items-center gap-2">
            <FileText className="w-7 h-7" />
            Mini Reports & Analytics
          </h1>
          <p className="text-gray-600">Comprehensive business insights</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Comparisons */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today vs Yesterday */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today vs Yesterday
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Today's Sales</p>
                <p className="text-2xl text-green-600">{comparison.today.sales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{currency}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Yesterday's Sales</p>
                <p className="text-2xl text-gray-900">{comparison.yesterday.sales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{currency}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Sales Change</span>
              <div className={`flex items-center gap-1 ${
                comparison.salesChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.salesChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {comparison.salesChange >= 0 ? '+' : ''}{comparison.salesChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Expenses Change</span>
              <div className={`flex items-center gap-1 ${
                comparison.expensesChange <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.expensesChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {comparison.expensesChange >= 0 ? '+' : ''}{comparison.expensesChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week vs Last Week */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              This Week vs Last Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">This Week</p>
                <p className="text-2xl text-green-600">{weekComparison.thisWeek.sales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{currency} sales</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Last Week</p>
                <p className="text-2xl text-gray-900">{weekComparison.lastWeek.sales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{currency} sales</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Weekly Sales Change</span>
              <div className={`flex items-center gap-1 ${
                weekComparison.salesChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {weekComparison.salesChange >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {weekComparison.salesChange >= 0 ? '+' : ''}{weekComparison.salesChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">This Week Profit:</span>
                <span className={weekComparison.thisWeek.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {weekComparison.thisWeek.profit >= 0 ? '+' : ''}{weekComparison.thisWeek.profit.toLocaleString()} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Week Profit:</span>
                <span className={weekComparison.lastWeek.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {weekComparison.lastWeek.profit >= 0 ? '+' : ''}{weekComparison.lastWeek.profit.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Sales Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value.toLocaleString()} ${currency}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Expense Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${currency}`} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Items Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top-Selling Items (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [`${value.toLocaleString()} ${currency}`, 'Revenue'];
                    return [value, 'Quantity'];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No sales data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabular Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Sales Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Sales</CardTitle>
            <Button size="sm" variant="outline" onClick={exportSalesCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 10).map((sale) => (
                    <tr key={sale.id} className="border-t">
                      <td className="p-2 text-gray-600">
                        {format(new Date(sale.date), 'MMM d, HH:mm')}
                      </td>
                      <td className="p-2 text-gray-900">{sale.customerName || 'Walk-in'}</td>
                      <td className="p-2 text-right text-gray-900">
                        {sale.total.toLocaleString()} {currency}
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={sale.synced ? 'default' : 'secondary'} className="text-xs">
                          {sale.synced ? 'Synced' : 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Expenses</CardTitle>
            <Button size="sm" variant="outline" onClick={exportExpensesCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-right p-2">Amount</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 10).map((expense) => (
                    <tr key={expense.id} className="border-t">
                      <td className="p-2 text-gray-600">
                        {format(new Date(expense.date), 'MMM d, HH:mm')}
                      </td>
                      <td className="p-2 text-gray-900">{expense.category}</td>
                      <td className="p-2 text-right text-gray-900">
                        {expense.amount.toLocaleString()} {currency}
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={expense.synced ? 'default' : 'secondary'} className="text-xs">
                          {expense.synced ? 'Synced' : 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-900">Export Full Reports</p>
                <p className="text-sm text-gray-600">Download detailed CSV files for offline analysis</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportSalesCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Sales Report
              </Button>
              <Button onClick={exportExpensesCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Expenses Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Indicator */}
      {!isOnline && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800 text-center">
              📊 <strong>Offline Mode:</strong> All analytics calculated locally • CSV export works offline
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}