import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function WeeklySummary() {
  const { sales, expenses, user, isOnline, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const currency = user?.currency || 'XAF';
  const today = new Date();

  // Calculate this week's data
  const weekData = useMemo(() => {
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const weekSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= weekStart && saleDate <= weekEnd;
    });

    const weekExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    });

    const totalSales = weekSales.reduce((sum, s) => sum + s.total, 0);
    const totalExpenses = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalSales - totalExpenses;

    // Calculate daily data for chart
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const day = subDays(today, 6 - i);
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const daySales = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= dayStart && saleDate <= dayEnd;
      });

      const dayExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= dayStart && expenseDate <= dayEnd;
      });

      const salesTotal = daySales.reduce((sum, s) => sum + s.total, 0);
      const expensesTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      dailyData.push({
        day: format(day, 'EEE'),
        date: format(day, 'MMM d'),
        sales: salesTotal,
        expenses: expensesTotal,
        profit: salesTotal - expensesTotal
      });
    }

    // Calculate item sales
    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    weekSales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const existing = itemSales.get(item.itemId) || { name: item.name, quantity: 0, revenue: 0 };
          itemSales.set(item.itemId, {
            name: item.name,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.price * item.quantity)
          });
        });
      }
    });

    const topItems = Array.from(itemSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Top performing days
    const topDays = [...dailyData]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      totalSales,
      totalExpenses,
      netProfit,
      salesCount: weekSales.length,
      expensesCount: weekExpenses.length,
      dailyData,
      topItems,
      topDays
    };
  }, [sales, expenses, today]);

  // Calculate last week's data for comparison
  const lastWeekData = useMemo(() => {
    const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });

    const lastWeekSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= lastWeekStart && saleDate <= lastWeekEnd;
    });

    const lastWeekExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= lastWeekStart && expenseDate <= lastWeekEnd;
    });

    return {
      totalSales: lastWeekSales.reduce((sum, s) => sum + s.total, 0),
      totalExpenses: lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  }, [sales, expenses, today]);

  // Calculate changes
  const salesChange = lastWeekData.totalSales > 0 
    ? ((weekData.totalSales - lastWeekData.totalSales) / lastWeekData.totalSales) * 100 
    : 0;
  const expensesChange = lastWeekData.totalExpenses > 0 
    ? ((weekData.totalExpenses - lastWeekData.totalExpenses) / lastWeekData.totalExpenses) * 100 
    : 0;
  const profitChange = (lastWeekData.totalSales - lastWeekData.totalExpenses) > 0
    ? ((weekData.netProfit - (lastWeekData.totalSales - lastWeekData.totalExpenses)) / (lastWeekData.totalSales - lastWeekData.totalExpenses)) * 100
    : 0;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (change: number, inverse = false) => {
    if (inverse) {
      if (change > 0) return 'text-red-600';
      if (change < 0) return 'text-green-600';
      return 'text-gray-600';
    }
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1 flex items-center gap-2">
            <Calendar className="w-7 h-7" />
            Weekly Summary
          </h1>
          <p className="text-gray-600">Last 7 days performance</p>
        </div>
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                  {weekData.salesCount} sales
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <motion.p 
                className="text-3xl text-green-600 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {weekData.totalSales.toLocaleString()} {currency}
              </motion.p>
              {lastWeekData.totalSales > 0 && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(salesChange)}`}>
                  {getTrendIcon(salesChange)}
                  <span>
                    {salesChange >= 0 ? '+' : ''}{salesChange.toFixed(1)}% vs last week
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-red-100 text-red-700 border-red-200 gap-1">
                  {weekData.expensesCount} expenses
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <motion.p 
                className="text-3xl text-red-600 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                {weekData.totalExpenses.toLocaleString()} {currency}
              </motion.p>
              {lastWeekData.totalExpenses > 0 && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(expensesChange, true)}`}>
                  {getTrendIcon(expensesChange)}
                  <span>
                    {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(1)}% vs last week
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Profit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`border-2 ${
            weekData.netProfit >= 0 
              ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white' 
              : 'border-orange-300 bg-gradient-to-br from-orange-50 to-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  weekData.netProfit >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Badge className={weekData.netProfit >= 0 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-orange-100 text-orange-700 border-orange-200'
                }>
                  {weekData.netProfit >= 0 ? 'Profit' : 'Loss'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <motion.p 
                className={`text-3xl mb-2 ${
                  weekData.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {weekData.netProfit >= 0 ? '+' : ''}{weekData.netProfit.toLocaleString()} {currency}
              </motion.p>
              {(lastWeekData.totalSales - lastWeekData.totalExpenses) > 0 && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(profitChange)}`}>
                  {getTrendIcon(profitChange)}
                  <span>
                    {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(1)}% vs last week
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Daily Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weekData.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `${value.toLocaleString()} ${currency}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Sales"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Sellers Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top-Selling Items (This Week)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weekData.topItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekData.topItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'quantity') return [`${value} units`, 'Quantity'];
                    return [`${value.toLocaleString()} ${currency}`, 'Revenue'];
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="quantity" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                  name="Quantity Sold"
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No sales data for this week</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Top Sellers List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Top Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weekData.topItems.length > 0 ? (
              <div className="space-y-3">
                {weekData.topItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{currency}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No sales this week</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Days */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Top Performing Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weekData.topDays.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg text-green-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{day.day}</p>
                    <p className="text-sm text-gray-600">{day.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">{day.sales.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{currency} sales</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Indicator */}
      {!isOnline && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800 text-center">
              📊 <strong>Offline Mode:</strong> All data calculated from local storage
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}