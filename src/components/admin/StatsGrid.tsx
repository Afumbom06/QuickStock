import { KPICard } from './KPICard';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Users 
} from 'lucide-react';

interface StatsGridProps {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  totalItems: number;
  lowStockCount: number;
  debtCustomersCount: number;
  currency: string;
  isOffline: boolean;
}

export function StatsGrid({
  totalSales,
  totalExpenses,
  netProfit,
  totalItems,
  lowStockCount,
  debtCustomersCount,
  currency,
  isOffline
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <KPICard
        title="Total Sales (All-Time)"
        value={totalSales}
        icon={DollarSign}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        currency={currency}
        isOffline={isOffline}
        linkTo="/sales"
        delay={0}
      />
      
      <KPICard
        title="Total Expenses (All-Time)"
        value={totalExpenses}
        icon={TrendingDown}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
        currency={currency}
        isOffline={isOffline}
        linkTo="/expenses"
        delay={0.1}
      />
      
      <KPICard
        title="Net Profit (All-Time)"
        value={netProfit}
        icon={TrendingUp}
        iconColor={netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}
        iconBgColor={netProfit >= 0 ? 'bg-blue-100' : 'bg-red-100'}
        currency={currency}
        isOffline={isOffline}
        linkTo="/reports"
        delay={0.2}
      />
      
      <KPICard
        title="Total Items in Inventory"
        value={totalItems}
        icon={Package}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
        suffix="items"
        isOffline={isOffline}
        linkTo="/inventory"
        delay={0.3}
      />
      
      <KPICard
        title="Low Stock Items"
        value={lowStockCount}
        icon={AlertTriangle}
        iconColor="text-yellow-600"
        iconBgColor="bg-yellow-100"
        suffix="items"
        isOffline={isOffline}
        linkTo="/inventory/alerts"
        delay={0.4}
      />
      
      <KPICard
        title="Customers with Debt"
        value={debtCustomersCount}
        icon={Users}
        iconColor="text-orange-600"
        iconBgColor="bg-orange-100"
        suffix="customers"
        isOffline={isOffline}
        linkTo="/customers"
        delay={0.5}
      />
    </div>
  );
}
