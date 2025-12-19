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
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

export function DailySummary() {
  const { sales, expenses, inventory, user, isOnline, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const currency = user?.currency || 'XAF';
  const today = new Date();
  const yesterday = subDays(today, 1);

  // Calculate today's data
  const todayData = useMemo(() => {
    // Safety checks for undefined data
    if (!sales || !expenses) {
      return {
        totalSales: 0,
        totalExpenses: 0,
        netProfit: 0,
        salesCount: 0,
        expensesCount: 0,
        topItems: [],
        activities: []
      };
    }

    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const todaySales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= todayStart && saleDate <= todayEnd;
    });

    const todayExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= todayStart && expenseDate <= todayEnd;
    });

    const totalSales = todaySales.reduce((sum, s) => sum + s.total, 0);
    const totalExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalSales - totalExpenses;

    // Calculate item sales
    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    todaySales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const key = (item as any).itemId || (item as any).id;
          const existing = itemSales.get(key) || { name: item.name, quantity: 0, revenue: 0 };
          itemSales.set(key, {
            name: item.name,
            quantity: existing.quantity + (item.quantity || 0),
            revenue: existing.revenue + ((item.price || 0) * (item.quantity || 0))
          });
        });
      }
    });

    const topItems = Array.from(itemSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Create activity timeline
    const activities = [
      ...todaySales.map(s => ({
        time: new Date(s.date),
        type: 'sale' as const,
        description: `Sale: ${s.items && Array.isArray(s.items) ? s.items.map(i => i.name).join(', ') : 'N/A'}`,
        amount: s.total
      })),
      ...todayExpenses.map(e => ({
        time: new Date(e.date),
        type: 'expense' as const,
        description: `Expense: ${e.category}`,
        amount: e.amount
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

    return {
      totalSales,
      totalExpenses,
      netProfit,
      salesCount: todaySales.length,
      expensesCount: todayExpenses.length,
      topItems,
      activities
    };
  }, [sales, expenses, today]);

  // Calculate yesterday's data for comparison
  const yesterdayData = useMemo(() => {
    // Safety checks for undefined data
    if (!sales || !expenses) {
      return {
        totalSales: 0,
        totalExpenses: 0,
      };
    }

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const yesterdaySales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= yesterdayStart && saleDate <= yesterdayEnd;
    });

    const yesterdayExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= yesterdayStart && expenseDate <= yesterdayEnd;
    });

    return {
      totalSales: yesterdaySales.reduce((sum, s) => sum + s.total, 0),
      totalExpenses: yesterdayExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  }, [sales, expenses, yesterday]);

  // Calculate changes
  const salesChange = yesterdayData.totalSales > 0 
    ? ((todayData.totalSales - yesterdayData.totalSales) / yesterdayData.totalSales) * 100 
    : 0;
  const expensesChange = yesterdayData.totalExpenses > 0 
    ? ((todayData.totalExpenses - yesterdayData.totalExpenses) / yesterdayData.totalExpenses) * 100 
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
            Daily Summary
          </h1>
          <p className="text-gray-600">{format(today, 'EEEE, MMMM d, yyyy')}</p>
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
                  {todayData.salesCount} sales
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <motion.p 
                className="text-3xl text-green-600 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {todayData.totalSales.toLocaleString()} {currency}
              </motion.p>
              {yesterdayData.totalSales > 0 && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(salesChange)}`}>
                  {getTrendIcon(salesChange)}
                  <span>
                    {salesChange >= 0 ? '+' : ''}{salesChange.toFixed(1)}% vs yesterday
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
                  {todayData.expensesCount} expenses
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <motion.p 
                className="text-3xl text-red-600 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                {todayData.totalExpenses.toLocaleString()} {currency}
              </motion.p>
              {yesterdayData.totalExpenses > 0 && (
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(expensesChange, true)}`}>
                  {getTrendIcon(expensesChange)}
                  <span>
                    {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(1)}% vs yesterday
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
            todayData.netProfit >= 0 
              ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white' 
              : 'border-orange-300 bg-gradient-to-br from-orange-50 to-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  todayData.netProfit >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Badge className={todayData.netProfit >= 0 
                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                  : 'bg-orange-100 text-orange-700 border-orange-200'
                }>
                  {todayData.netProfit >= 0 ? 'Profit' : 'Loss'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <motion.p 
                className={`text-3xl mb-2 ${
                  todayData.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {todayData.netProfit >= 0 ? '+' : ''}{todayData.netProfit.toLocaleString()} {currency}
              </motion.p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {todayData.netProfit >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span>Sales - Expenses</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top-Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-5 h-5" />
              Today's Top-Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayData.topItems.length > 0 ? (
              <div className="space-y-3">
                {todayData.topItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                <p className="text-gray-500">No sales recorded today yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayData.activities.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {todayData.activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'sale' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {activity.type === 'sale' ? (
                          <ShoppingCart className="w-4 h-4" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                      </div>
                      {index < todayData.activities.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {format(activity.time, 'HH:mm')}
                          </p>
                        </div>
                        <span className={`text-sm ${
                          activity.type === 'sale' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {activity.type === 'sale' ? '+' : '-'}{activity.amount.toLocaleString()} {currency}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No activity recorded today yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Sale</p>
              <p className="text-2xl text-gray-900">
                {todayData.salesCount > 0 
                  ? (todayData.totalSales / todayData.salesCount).toFixed(0) 
                  : '0'}
              </p>
              <p className="text-xs text-gray-500">{currency}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl text-gray-900">
                {todayData.salesCount + todayData.expensesCount}
              </p>
              <p className="text-xs text-gray-500">today</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
              <p className="text-2xl text-gray-900">
                {todayData.totalSales > 0 
                  ? ((todayData.netProfit / todayData.totalSales) * 100).toFixed(1) 
                  : '0'}%
              </p>
              <p className="text-xs text-gray-500">of sales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Items Sold</p>
              <p className="text-2xl text-gray-900">
                {todayData.topItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500">units</p>
            </div>
          </div>
        </CardContent>
      </Card>

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