import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Edit,
  Plus,
  Package,
  TrendingDown,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function StockAlerts() {
  const { inventory, user } = useApp();
  const navigate = useNavigate();
  const [filterLevel, setFilterLevel] = useState('all');

  const currency = user?.currency || 'XAF';

  // Filter alerts
  const alertItems = inventory.filter(item => {
    const isCritical = item.quantity <= item.lowStockAlert / 2;
    const isLow = item.quantity <= item.lowStockAlert && !isCritical;
    
    if (filterLevel === 'critical') return isCritical;
    if (filterLevel === 'low') return isLow;
    return item.quantity <= item.lowStockAlert; // all
  });

  const criticalCount = inventory.filter(i => i.quantity <= i.lowStockAlert / 2).length;
  const lowCount = inventory.filter(i => i.quantity <= i.lowStockAlert && i.quantity > i.lowStockAlert / 2).length;

  const getAlertStatus = (item: any) => {
    if (item.quantity <= item.lowStockAlert / 2) {
      return {
        color: 'text-red-600',
        bg: 'bg-red-100',
        borderColor: 'border-red-300',
        label: 'Critical',
        icon: AlertCircle,
        message: 'Restock immediately to avoid running out!'
      };
    }
    return {
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      label: 'Low Stock',
      icon: AlertTriangle,
      message: 'Stock is running low. Consider restocking soon.'
    };
  };

  // Simple predictive insight
  const getStockInsight = (item: any) => {
    const daysUntilOut = Math.floor(item.quantity / Math.max(1, item.quantity * 0.1)); // Simple estimation
    
    if (item.quantity <= item.lowStockAlert / 2) {
      return `Only ${item.quantity} units left! Usually sells out in ${daysUntilOut} days.`;
    } else if (item.quantity <= item.lowStockAlert) {
      return `${item.quantity} units remaining. Consider restocking this week.`;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Stock Alerts</h1>
            <p className="text-gray-600">
              {alertItems.length} items need attention
            </p>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700">Total Alerts</p>
                <p className="text-3xl text-yellow-600 mt-1">{alertItems.length}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-200 rounded-full flex items-center justify-center">
                <Bell className="w-7 h-7 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700">Critical</p>
                <p className="text-3xl text-red-600 mt-1">{criticalCount}</p>
                <p className="text-xs text-red-600 mt-1">Urgent action needed</p>
              </div>
              <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700">Low Stock</p>
                <p className="text-3xl text-yellow-600 mt-1">{lowCount}</p>
                <p className="text-xs text-yellow-600 mt-1">Restock soon</p>
              </div>
              <div className="w-14 h-14 bg-yellow-200 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Filter by:</span>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts ({alertItems.length})</SelectItem>
                <SelectItem value="critical">Critical Only ({criticalCount})</SelectItem>
                <SelectItem value="low">Low Stock Only ({lowCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alertItems.map((item, index) => {
          const status = getAlertStatus(item);
          const AlertIcon = status.icon;
          const insight = getStockInsight(item);
          const profitMargin = ((item.sellingPrice - item.costPrice) / item.costPrice * 100);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-2 ${status.borderColor}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Alert Icon */}
                    <div className={`w-14 h-14 ${status.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <AlertIcon className={`w-7 h-7 ${status.color}`} />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg text-gray-900">{item.name}</h3>
                            <Badge className={`${status.bg} ${status.color} border-current`}>
                              {status.label}
                            </Badge>
                          </div>
                          {item.category && (
                            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Current Stock</p>
                          <p className={`text-3xl ${status.color}`}>
                            {item.quantity}
                          </p>
                          <p className="text-xs text-gray-500">units</p>
                        </div>
                      </div>

                      {/* Stock Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div 
                          className={`h-3 rounded-full ${
                            item.quantity <= item.lowStockAlert / 2 ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ 
                            width: `${Math.min((item.quantity / (item.lowStockAlert * 2)) * 100, 100)}%` 
                          }}
                        />
                      </div>

                      {/* Warning Message */}
                      <div className={`p-3 rounded-lg ${status.bg} mb-3`}>
                        <p className={`text-sm ${status.color} flex items-center gap-2`}>
                          <AlertTriangle className="w-4 h-4" />
                          {status.message}
                        </p>
                      </div>

                      {/* Predictive Insight */}
                      {insight && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            <strong>Insight:</strong> {insight}
                          </p>
                        </div>
                      )}

                      {/* Item Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Alert Threshold</p>
                          <p className="text-gray-900">{item.lowStockAlert} units</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Cost Price</p>
                          <p className="text-gray-900">{item.costPrice.toLocaleString()} {currency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Selling Price</p>
                          <p className="text-gray-900">{item.sellingPrice.toLocaleString()} {currency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">Profit Margin</p>
                          <p className="text-green-600">{profitMargin.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link to={`/inventory/${item.id}/edit`}>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Stock
                          </Button>
                        </Link>
                        <Link to={`/inventory/${item.id}/edit`}>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Item
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {alertItems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg text-gray-900 mb-2">All stock levels healthy!</h3>
              <p className="text-gray-500 mb-4">
                {filterLevel !== 'all' 
                  ? 'No items match this alert level. Try changing the filter.'
                  : 'No items are below their alert thresholds. Great job managing your inventory!'}
              </p>
              <Link to="/inventory">
                <Button className="gap-2">
                  <Package className="w-4 h-4" />
                  View All Inventory
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
