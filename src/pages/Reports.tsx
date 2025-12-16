import { Link } from 'react-router';
import { 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  FileText,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Package,
  ArrowRight,
  Download
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

export function Reports() {
  const { sales, expenses, t, user } = useApp();

  const currency = user?.currency || 'XAF';

  // Daily summary
  const getDailySummary = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(dateStr => {
      const daySales = sales.filter(s => s.date.startsWith(dateStr));
      const dayExpenses = expenses.filter(e => e.date.startsWith(dateStr));
      const totalSales = daySales.reduce((sum, s) => sum + s.total, 0);
      const totalExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        date: new Date(dateStr).toLocaleDateString('en', { weekday: 'short' }),
        sales: totalSales,
        expenses: totalExpenses,
        profit: totalSales - totalExpenses,
      };
    });
  };

  // Top selling items
  const getTopItems = () => {
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    sales.forEach(sale => {
      const existing = itemMap.get(sale.itemName) || { name: sale.itemName, quantity: 0, revenue: 0 };
      existing.quantity += sale.quantity;
      existing.revenue += sale.total;
      itemMap.set(sale.itemName, existing);
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Expense breakdown
  const getExpenseBreakdown = () => {
    const categories = ['transport', 'restock', 'bills', 'other'];
    return categories.map(category => {
      const categoryExpenses = expenses.filter(e => e.category === category);
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        name: t(category as any),
        value: total,
      };
    }).filter(item => item.value > 0);
  };

  const dailyData = getDailySummary();
  const topItems = getTopItems();
  const expenseBreakdown = getExpenseBreakdown();

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-2">{t('reports')}</h1>
        <p className="text-gray-600">Business analytics and insights</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/reports/daily">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
          >
            <Card className="border-2 hover:border-blue-400 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Daily Summary</h3>
                <p className="text-sm text-gray-600 mb-4">
                  View today's sales, expenses, and profit with activity timeline
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <span>View report</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>

        <Link to="/reports/weekly">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
          >
            <Card className="border-2 hover:border-green-400 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Weekly Summary</h3>
                <p className="text-sm text-gray-600 mb-4">
                  7-day performance with charts, trends, and top sellers
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <span>View report</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>

        <Link to="/reports/analytics">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
          >
            <Card className="border-2 hover:border-purple-400 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-purple-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">Mini Reports</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Analytics, comparisons, charts & CSV export
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <span>View analytics</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{totalSales.toLocaleString()} {currency}</div>
            <p className="text-xs text-gray-500 mt-1">{sales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{totalExpenses.toLocaleString()} {currency}</div>
            <p className="text-xs text-gray-500 mt-1">{expenses.length} expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">{t('netProfit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit.toLocaleString()} {currency}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {netProfit >= 0 ? 'Profitable' : 'Loss'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="daily">{t('dailySummary')}</TabsTrigger>
          <TabsTrigger value="items">{t('topSellingItems')}</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profit">Profit Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>{t('weeklySummary')} - Sales & Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#10b981" name="Sales" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>{t('topSellingItems')}</CardTitle>
            </CardHeader>
            <CardContent>
              {topItems.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topItems} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {topItems.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl text-gray-400">#{index + 1}</div>
                          <div>
                            <div className="text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.quantity} units sold</div>
                          </div>
                        </div>
                        <div className="text-lg text-gray-900">{item.revenue.toLocaleString()} {currency}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">No sales data yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {expenseBreakdown.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {expenseBreakdown.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div className="text-gray-900">{item.name}</div>
                        </div>
                        <div className="text-gray-900">{item.value.toLocaleString()} {currency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No expense data yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <CardTitle>Daily Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}