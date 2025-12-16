import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  AlertCircle,
  Clock,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'sale' | 'expense' | 'inventory' | 'customer' | 'debt' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  synced: boolean;
  icon: any;
  iconBg: string;
  iconColor: string;
}

type TimeFilter = 'today' | 'yesterday' | 'week' | 'all';

export function ActivityOverview() {
  const { sales, expenses, inventory, customers, debts, isOnline } = useApp();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<TimeFilter>('today');

  useEffect(() => {
    const loadActivities = () => {
      const allActivities: Activity[] = [];

      // Add sales
      sales.slice(0, 50).forEach(sale => {
        allActivities.push({
          id: `sale-${sale.id}`,
          type: 'sale',
          title: 'New Sale Recorded',
          description: `${sale.itemName} - ${sale.quantity} units for ${sale.total.toLocaleString()} XAF`,
          timestamp: new Date(sale.date),
          synced: sale.synced || false,
          icon: ShoppingCart,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
        });
      });

      // Add expenses
      expenses.slice(0, 50).forEach(expense => {
        allActivities.push({
          id: `expense-${expense.id}`,
          type: 'expense',
          title: 'Expense Logged',
          description: `${expense.category} - ${expense.amount.toLocaleString()} XAF: ${expense.description}`,
          timestamp: new Date(expense.date),
          synced: expense.synced || false,
          icon: DollarSign,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
        });
      });

      // Add inventory updates (recent items)
      inventory.slice(0, 20).forEach(item => {
        allActivities.push({
          id: `inventory-${item.id}`,
          type: 'inventory',
          title: 'Inventory Updated',
          description: `${item.name} - ${item.quantity} units in stock`,
          timestamp: new Date(item.createdAt || Date.now()),
          synced: item.synced || false,
          icon: Package,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        });
      });

      // Add customer activities
      customers.slice(0, 20).forEach(customer => {
        allActivities.push({
          id: `customer-${customer.id}`,
          type: 'customer',
          title: 'New Customer Added',
          description: `${customer.name}${customer.phone ? ` - ${customer.phone}` : ''}`,
          timestamp: new Date(customer.createdAt || Date.now()),
          synced: customer.synced || false,
          icon: Users,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        });
      });

      // Add debt activities (recent debts)
      debts.slice(0, 30).forEach(debt => {
        const customer = customers.find(c => c.id === debt.customerId);
        allActivities.push({
          id: `debt-${debt.id}`,
          type: 'debt',
          title: debt.type === 'credit' ? 'Debt Added' : 'Payment Received',
          description: `${customer?.name || 'Customer'} - ${debt.amount.toLocaleString()} XAF${debt.description ? `: ${debt.description}` : ''}`,
          timestamp: new Date(debt.date),
          synced: debt.synced || false,
          icon: debt.type === 'credit' ? TrendingUp : DollarSign,
          iconBg: debt.type === 'credit' ? 'bg-orange-100' : 'bg-green-100',
          iconColor: debt.type === 'credit' ? 'text-orange-600' : 'text-green-600',
        });
      });

      // Add stock alerts
      inventory
        .filter(item => item.quantity <= item.lowStockAlert)
        .forEach(item => {
          allActivities.push({
            id: `alert-${item.id}`,
            type: 'alert',
            title: 'Low Stock Alert',
            description: `${item.name} - Only ${item.quantity} units left (Alert: ${item.lowStockAlert})`,
            timestamp: new Date(),
            synced: true,
            icon: AlertCircle,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
          });
        });

      // Sort by timestamp (newest first)
      allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setActivities(allActivities);
    };

    loadActivities();
  }, [sales, expenses, inventory, customers, debts]);

  const getFilteredActivities = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    switch (filter) {
      case 'today':
        return activities.filter(a => a.timestamp >= today);
      case 'yesterday':
        return activities.filter(a => a.timestamp >= yesterday && a.timestamp < today);
      case 'week':
        return activities.filter(a => a.timestamp >= weekAgo);
      case 'all':
      default:
        return activities;
    }
  };

  const filteredActivities = getFilteredActivities();

  const getActivityStats = () => {
    const stats = {
      today: activities.filter(a => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return a.timestamp >= today;
      }).length,
      pending: activities.filter(a => !a.synced).length,
      total: activities.length,
    };
    return stats;
  };

  const stats = getActivityStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 mb-1 flex items-center gap-2">
          <Clock className="w-7 h-7" />
          Activity Overview
        </h1>
        <p className="text-gray-600">Recent actions and updates in your shop</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Activity</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.today}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Sync</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as TimeFilter)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardContent className="p-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities found for this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex gap-4 relative"
                    >
                      {/* Timeline line */}
                      {index < filteredActivities.length - 1 && (
                        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      {/* Icon */}
                      <div className={`w-12 h-12 ${activity.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 z-10`}>
                        <Icon className={`w-6 h-6 ${activity.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm text-gray-900">{activity.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!activity.synced && (
                              <Badge variant="secondary" className="text-xs">
                                Pending Sync
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offline Notice */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">
                    <strong>Offline Mode</strong>
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    Activity log is loaded from your local database. New activities added offline will show "Pending Sync" until you're back online.
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
