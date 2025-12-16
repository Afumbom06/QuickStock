import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ActivityTimeline, Activity } from './ActivityTimeline';
import { OfflineIndicatorBanner } from './OfflineIndicatorBanner';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'motion/react';

type TimeFilter = 'today' | 'yesterday' | 'week' | 'all';

export function ActivityOverviewTab() {
  const { sales, expenses, inventory, customers, isOnline, syncQueueCount } = useApp();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');

  // Generate activities from all data sources
  const allActivities = useMemo(() => {
    const activities: Activity[] = [];

    // Sales activities
    sales.forEach(sale => {
      const itemCount = sale.items && Array.isArray(sale.items) ? sale.items.length : 0;
      activities.push({
        id: `sale-${sale.id}`,
        type: 'sale',
        title: 'New Sale',
        description: `Sale of ${itemCount} ${itemCount === 1 ? 'item' : 'items'} for ${sale.total} ${sale.currency || 'XAF'}`,
        timestamp: sale.date,
        isPending: sale.synced === false,
      });
    });

    // Expense activities
    expenses.forEach(expense => {
      activities.push({
        id: `expense-${expense.id}`,
        type: 'expense',
        title: 'Expense Logged',
        description: `${expense.category}: ${expense.amount} ${expense.currency || 'XAF'}`,
        timestamp: expense.date,
        isPending: expense.synced === false,
      });
    });

    // Inventory activities (only recent additions/updates)
    inventory.forEach(item => {
      if (item.updatedAt) {
        activities.push({
          id: `inventory-${item.id}`,
          type: 'inventory',
          title: 'Inventory Updated',
          description: `${item.name}: ${item.quantity} units in stock`,
          timestamp: item.updatedAt,
          isPending: item.synced === false,
        });
      }
    });

    // Low stock alerts
    inventory.forEach(item => {
      if (item.quantity <= item.lowStockAlert) {
        activities.push({
          id: `alert-${item.id}`,
          type: 'alert',
          title: 'Low Stock Alert',
          description: `${item.name} is running low (${item.quantity} remaining)`,
          timestamp: item.updatedAt || new Date().toISOString(),
        });
      }
    });

    // Customer activities (debt additions)
    customers.forEach(customer => {
      if (customer.totalDebt > 0 && customer.updatedAt) {
        activities.push({
          id: `customer-${customer.id}`,
          type: 'customer',
          title: 'Debt Updated',
          description: `${customer.name}: ${customer.totalDebt} ${customer.currency || 'XAF'} outstanding`,
          timestamp: customer.updatedAt,
          isPending: customer.synced === false,
        });
      }
    });

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [sales, expenses, inventory, customers]);

  // Filter activities based on time filter
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return allActivities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      
      switch (timeFilter) {
        case 'today':
          return activityDate >= today;
        case 'yesterday':
          return activityDate >= yesterday && activityDate < today;
        case 'week':
          return activityDate >= weekAgo;
        case 'all':
        default:
          return true;
      }
    });
  }, [allActivities, timeFilter]);

  const pendingCount = filteredActivities.filter(a => a.isPending).length;

  return (
    <div className="space-y-6">
      <OfflineIndicatorBanner isOnline={isOnline} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl text-gray-900">Activity Overview</h2>
          <p className="text-gray-600 mt-1">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
            {pendingCount > 0 && ` (${pendingCount} pending sync)`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ActivityTimeline activities={filteredActivities} />
      </motion.div>
    </div>
  );
}