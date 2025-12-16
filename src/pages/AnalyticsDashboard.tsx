import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  Users,
  ShoppingCart,
  ArrowRight,
  Wallet,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface KPIData {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  totalItems: number;
  lowStockCount: number;
  customersWithDebt: number;
}

export function AnalyticsDashboard() {
  const { sales, expenses, inventory, customers, debts, isOnline, user } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KPIData>({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalItems: 0,
    lowStockCount: 0,
    customersWithDebt: 0,
  });

  useEffect(() => {
    // Simulate loading from IndexedDB
    const loadData = async () => {
      setLoading(true);
      
      // Simulate slight delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const netProfit = totalSales - totalExpenses;
      const totalItems = inventory.length;
      const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockAlert).length;
      
      // Calculate customers with debt
      const customersWithDebtCount = customers.filter(customer => {
        const customerDebts = debts.filter(d => d.customerId === customer.id);
        const totalDebt = customerDebts
          .filter(d => d.type === 'credit')
          .reduce((sum, d) => sum + d.amount, 0);
        const totalPaid = customerDebts
          .filter(d => d.type === 'payment')
          .reduce((sum, d) => sum + d.amount, 0);
        return (totalDebt - totalPaid) > 0;
      }).length;

      setKpiData({
        totalSales,
        totalExpenses,
        netProfit,
        totalItems,
        lowStockCount,
        customersWithDebt: customersWithDebtCount,
      });

      setLoading(false);
    };

    loadData();
  }, [sales, expenses, inventory, customers, debts]);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${user?.currency || 'XAF'}`;
  };

  const kpiCards = [
    {
      id: 'sales',
      title: 'Total Sales',
      value: formatCurrency(kpiData.totalSales),
      icon: ShoppingCart,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: '+12.5%',
      trendUp: true,
      route: '/sales',
      description: `${sales.length} transactions`,
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: formatCurrency(kpiData.totalExpenses),
      icon: Wallet,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: '+8.2%',
      trendUp: true,
      route: '/expenses',
      description: `${expenses.length} expenses logged`,
    },
    {
      id: 'profit',
      title: 'Net Profit',
      value: formatCurrency(kpiData.netProfit),
      icon: TrendingUp,
      iconBg: kpiData.netProfit >= 0 ? 'bg-blue-100' : 'bg-orange-100',
      iconColor: kpiData.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600',
      trend: kpiData.netProfit >= 0 ? '+5.3%' : '-2.1%',
      trendUp: kpiData.netProfit >= 0,
      route: '/reports',
      description: 'All-time',
    },
    {
      id: 'inventory',
      title: 'Inventory Items',
      value: kpiData.totalItems.toString(),
      icon: Package,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      route: '/inventory',
      description: 'Items in stock',
    },
    {
      id: 'lowstock',
      title: 'Low Stock Alerts',
      value: kpiData.lowStockCount.toString(),
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      route: '/inventory/alerts',
      description: 'Need attention',
      alert: kpiData.lowStockCount > 0,
    },
    {
      id: 'debts',
      title: 'Customers with Debt',
      value: kpiData.customersWithDebt.toString(),
      icon: Users,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      route: '/customers',
      description: `Out of ${customers.length} total`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1 flex items-center gap-2">
            <BarChart3 className="w-7 h-7" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Quick overview of your business performance</p>
        </div>
        {!isOnline && (
          <Badge variant="secondary" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Offline Mode
          </Badge>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading Skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual KPI Cards
          kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden"
                  onClick={() => navigate(card.route)}
                >
                  {/* Offline Indicator */}
                  {!isOnline && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        Cached
                      </Badge>
                    </div>
                  )}

                  {/* Alert Badge */}
                  {card.alert && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        Alert
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Icon and Trend */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                      </div>
                      {card.trend && (
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          card.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {card.trendUp ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {card.trend}
                        </div>
                      )}
                    </div>

                    {/* Value */}
                    <h3 className="text-2xl text-gray-900 mb-1">
                      {card.value}
                    </h3>

                    {/* Title and Description */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">{card.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{card.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'New Sale', icon: ShoppingCart, route: '/sales/add', color: 'text-green-600' },
                { label: 'Add Expense', icon: DollarSign, route: '/expenses/add', color: 'text-red-600' },
                { label: 'View Reports', icon: BarChart3, route: '/reports', color: 'text-blue-600' },
                { label: 'Manage Stock', icon: Package, route: '/inventory', color: 'text-purple-600' },
              ].map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.route)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <ActionIcon className={`w-6 h-6 ${action.color}`} />
                    <span className="text-sm text-gray-700">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Banner */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">
                    <strong>Using offline data</strong>
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    These statistics are calculated from your local database. 
                    Connect to the internet to refresh and sync.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
