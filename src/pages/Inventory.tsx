import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';
import { 
  Plus, 
  AlertTriangle, 
  Edit, 
  Search,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Bell
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Inventory() {
  const { inventory, t, user, isOnline, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const currency = user?.currency || 'XAF';

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Stock filter
    let matchesStock = true;
    if (filterStock === 'low') {
      matchesStock = item.quantity <= item.lowStockAlert;
    } else if (filterStock === 'healthy') {
      matchesStock = item.quantity > item.lowStockAlert;
    } else if (filterStock === 'critical') {
      matchesStock = item.quantity <= item.lowStockAlert / 2;
    }

    // Category filter
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesStock && matchesCategory;
  });

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'stock-low':
        return a.quantity - b.quantity;
      case 'stock-high':
        return b.quantity - a.quantity;
      case 'price-low':
        return a.sellingPrice - b.sellingPrice;
      case 'price-high':
        return b.sellingPrice - a.sellingPrice;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.lowStockAlert).length;
  const criticalStockItems = inventory.filter(i => i.quantity <= i.lowStockAlert / 2).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const syncedCount = inventory.filter(i => i.synced).length;
  const pendingCount = inventory.filter(i => !i.synced).length;

  const getStockStatus = (item: any) => {
    const percentage = (item.quantity / item.lowStockAlert) * 100;
    if (item.quantity <= item.lowStockAlert / 2) {
      return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical', icon: AlertCircle };
    } else if (item.quantity <= item.lowStockAlert) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low', icon: AlertTriangle };
    } else {
      return { color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy', icon: CheckCircle2 };
    }
  };

  const getSyncBadge = (synced?: boolean) => {
    if (synced) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 text-xs">
          <CheckCircle2 className="w-3 h-3" />
          Synced
        </Badge>
      );
    }
    if (isOnline) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1 text-xs">
          <Clock className="w-3 h-3" />
          Syncing
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200 gap-1 text-xs">
        <AlertCircle className="w-3 h-3" />
        Pending
      </Badge>
    );
  };

  const allCategories = Array.from(new Set(inventory.map(i => i.category).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">{t('inventoryList')}</h1>
          <p className="text-gray-600">
            {totalItems} items · {totalValue.toLocaleString()} {currency} total value
          </p>
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
          {lowStockItems > 0 && (
            <Link to="/inventory/alerts">
              <Button variant="outline" size="sm" className="gap-2 border-yellow-500 text-yellow-700">
                <Bell className="w-4 h-4" />
                {lowStockItems} Alerts
              </Button>
            </Link>
          )}
          <Link to="/inventory/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Items</p>
                <p className="text-2xl text-gray-900 mt-1">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Low Stock</p>
                <p className="text-2xl text-yellow-600 mt-1">{lowStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Critical</p>
                <p className="text-2xl text-red-600 mt-1">{criticalStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Sync</p>
                <p className="text-2xl text-blue-600 mt-1">{pendingCount}</p>
                <p className="text-xs text-green-600">{syncedCount} synced</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stock Filter */}
            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="healthy">Healthy Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="critical">Critical Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(cat => (
                  <SelectItem key={cat} value={cat!} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="stock-low">Stock (Low to High)</SelectItem>
                <SelectItem value="stock-high">Stock (High to Low)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedInventory.map((item, index) => {
          const status = getStockStatus(item);
          const StatusIcon = status.icon;
          const profitMargin = ((item.sellingPrice - item.costPrice) / item.costPrice * 100);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-lg transition-shadow ${
                item.quantity <= item.lowStockAlert / 2 ? 'border-2 border-red-300' : 
                item.quantity <= item.lowStockAlert ? 'border-2 border-yellow-300' : ''
              }`}>
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 ${status.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Package className={`w-5 h-5 ${status.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 truncate">{item.name}</h3>
                          {item.category && (
                            <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${status.bg} ${status.color} border-current gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                        {getSyncBadge(item.synced)}
                      </div>
                    </div>

                    <Link to={`/inventory/${item.id}/edit`}>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Stock Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stock</span>
                      <span className={`text-lg ${status.color}`}>
                        {item.quantity} units
                      </span>
                    </div>

                    {/* Stock Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.quantity <= item.lowStockAlert / 2 ? 'bg-red-500' :
                          item.quantity <= item.lowStockAlert ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min((item.quantity / (item.lowStockAlert * 2)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 text-sm border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="text-gray-900">{item.costPrice.toLocaleString()} {currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling:</span>
                      <span className="text-gray-900">{item.sellingPrice.toLocaleString()} {currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Margin:</span>
                      <span className={profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {profitMargin >= 0 && '+'}{profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Low Stock Warning */}
                  {item.quantity <= item.lowStockAlert && (
                    <div className={`mt-3 text-xs p-2 rounded flex items-center gap-2 ${
                      item.quantity <= item.lowStockAlert / 2
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>
                        {item.quantity <= item.lowStockAlert / 2
                          ? 'Critical! Restock immediately'
                          : 'Low stock alert! Restock soon'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {sortedInventory.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStock !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first inventory item to get started!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      <Link to="/inventory/new">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button 
            size="lg" 
            className="w-16 h-16 rounded-full shadow-2xl bg-blue-900 hover:bg-blue-800"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </motion.div>
      </Link>
    </div>
  );
}