import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Plus, ShoppingCart, DollarSign, Package, CheckCircle2, User, BarChart3, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '../components/ui/badge';
import { CountUpAnimation } from '../components/CountUpAnimation';
import { motion } from 'motion/react';

export function Dashboard() {
  const { sales, expenses, inventory, t, user, isOnline, syncQueueCount } = useApp();

  // Calculate today's metrics
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date.startsWith(today));
  const todayExpenses = expenses.filter(e => e.date.startsWith(today));

  const totalSalesToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpensesToday = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const profitToday = totalSalesToday - totalExpensesToday;

  // Low stock alerts
  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockAlert);

  // Weekly sales data for chart
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map((day, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateStr = date.toISOString().split('T')[0];
      const daySales = sales.filter(s => s.date.startsWith(dateStr));
      const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
      return { day, sales: total };
    });
    return data;
  };

  const currency = user?.currency || 'XAF';
  const weeklyData = getWeeklyData();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Sync Status */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">{t('dashboard')}</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Online
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
              Offline
            </Badge>
          )}
          {syncQueueCount > 0 && (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              🔄 Sync Pending ({syncQueueCount})
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards with Animation */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Sales Card */}
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">{t('todaySales')}</CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-blue-600 mb-1">
                <CountUpAnimation end={totalSalesToday} /> {currency}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {todaySales.length} transactions today
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses Card */}
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">{t('todayExpenses')}</CardTitle>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-red-600 mb-1">
                <CountUpAnimation end={totalExpensesToday} /> {currency}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" />
                {todayExpenses.length} expenses today
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profit Card */}
        <motion.div variants={item}>
          <Card className={`border-l-4 ${profitToday >= 0 ? 'border-l-green-500' : 'border-l-orange-500'} hover:shadow-lg transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">{t('todayProfit')}</CardTitle>
              <div className={`w-10 h-10 ${profitToday >= 0 ? 'bg-green-100' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
                <TrendingUp className={`w-5 h-5 ${profitToday >= 0 ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl mb-1 ${profitToday >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                <CountUpAnimation end={profitToday} /> {currency}
              </div>
              <p className="text-xs text-gray-500">
                {profitToday >= 0 ? '✅ Profitable today' : '⚠️ Loss today'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Action Bar - Floating Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <Link to="/sales/new">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 gap-2 shadow-md hover:shadow-lg transition-all">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('addSale')}</span>
                    <span className="sm:hidden">Sale</span>
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <Link to="/expenses/new">
                  <Button variant="outline" className="w-full h-14 gap-2 border-2 hover:bg-white transition-all">
                    <DollarSign className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('addExpense')}</span>
                    <span className="sm:hidden">Expense</span>
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <Link to="/inventory/new">
                  <Button variant="outline" className="w-full h-14 gap-2 border-2 hover:bg-white transition-all">
                    <Package className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('addStock')}</span>
                    <span className="sm:hidden">Stock</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Low Stock Alerts Widget */}
      {lowStockItems.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-yellow-300 bg-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-900">{t('lowStock')}</span>
                </CardTitle>
                <Link to="/inventory">
                  <Button variant="ghost" size="sm" className="text-yellow-700 hover:bg-yellow-100">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm text-gray-900">{item.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {item.quantity} left
                    </Badge>
                  </div>
                ))}
                {lowStockItems.length > 5 && (
                  <p className="text-xs text-yellow-700 text-center pt-2">
                    +{lowStockItems.length - 5} more items need restocking
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-800">All items in stock ✓</span>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weekly Sales Chart with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 {t('weeklySales')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [`${value} ${currency}`, 'Sales']}
                />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === weeklyData.length - 1 ? '#3b82f6' : '#93c5fd'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Sales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sales</CardTitle>
            <Link to="/sales">
              <Button variant="ghost" size="sm">View all →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sales.slice(0, 5).map((sale, index) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-900">{sale.itemName}</div>
                      <div className="text-xs text-gray-500">
                        {sale.quantity} × {sale.price.toLocaleString()} {currency}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">{sale.total.toLocaleString()} {currency}</div>
                    <div className="text-xs text-gray-500">{new Date(sale.date).toLocaleTimeString()}</div>
                  </div>
                </motion.div>
              ))}
              {sales.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-gray-600">No sales yet</p>
                  <p className="text-sm text-gray-500 mt-1">Add your first sale to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Admin/Profile Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg">Admin Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-white hover:border-purple-300 transition-all">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-900">My Profile</div>
                    <div className="text-xs text-gray-500">Account settings</div>
                  </div>
                </Button>
              </Link>

              <Link to="/analytics-dashboard">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-900">Analytics</div>
                    <div className="text-xs text-gray-500">Business insights</div>
                  </div>
                </Button>
              </Link>

              <Link to="/activity-overview">
                <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-white hover:border-indigo-300 transition-all">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-900">Activity Log</div>
                    <div className="text-xs text-gray-500">Recent actions</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}