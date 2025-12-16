import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { 
  Plus, 
  Search,
  Truck,
  Package,
  Receipt,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Expenses() {
  const { expenses, t, user, isOnline, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const categoryIcons: Record<string, any> = {
    transport: { icon: Truck, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    restock: { icon: Package, color: 'bg-green-100 text-green-700 border-green-200' },
    bills: { icon: Receipt, color: 'bg-red-100 text-red-700 border-red-200' },
    utilities: { icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    other: { icon: MoreHorizontal, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  };

  // Get icon for custom categories
  const getCategoryIcon = (category: string) => {
    const normalizedCat = category.toLowerCase();
    if (categoryIcons[normalizedCat]) {
      return categoryIcons[normalizedCat];
    }
    return { icon: MoreHorizontal, color: 'bg-purple-100 text-purple-700 border-purple-200' };
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    // Search filter
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filterCategory === 'all' || expense.category.toLowerCase() === filterCategory;

    // Date filter
    let matchesDate = true;
    if (filterDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = expense.date.startsWith(today);
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(expense.date) >= weekAgo;
    } else if (filterDate === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(expense.date) >= monthAgo;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date-desc':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Group by date
  const groupedExpenses: Record<string, typeof expenses> = {};
  sortedExpenses.forEach(expense => {
    const date = new Date(expense.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label;
    if (date.toDateString() === today.toDateString()) {
      label = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    if (!groupedExpenses[label]) {
      groupedExpenses[label] = [];
    }
    groupedExpenses[label].push(expense);
  });

  const currency = user?.currency || 'XAF';

  // Calculate stats
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const todayExpenses = expenses.filter(e => e.date.startsWith(new Date().toISOString().split('T')[0]));
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
  const weekTotal = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Get highest category
  const categorySums: Record<string, number> = {};
  filteredExpenses.forEach(exp => {
    categorySums[exp.category] = (categorySums[exp.category] || 0) + exp.amount;
  });
  const highestCategory = Object.entries(categorySums).sort((a, b) => b[1] - a[1])[0];

  const syncedCount = filteredExpenses.filter(e => e.synced).length;
  const pendingCount = filteredExpenses.filter(e => !e.synced).length;

  const getSyncStatusBadge = (synced?: boolean) => {
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

  const allCategories = Array.from(new Set(expenses.map(e => e.category.toLowerCase())));

  return (
    <div className="h-full flex flex-col space-y-6 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">{t('expenseList')}</h1>
          <p className="text-gray-600">
            {filteredExpenses.length} expenses · {totalExpenses.toLocaleString()} {currency} total
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
          <Link to="/expenses/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Expense
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
                <p className="text-xs text-gray-600">Today</p>
                <p className="text-lg text-red-600 mt-1">
                  {todayTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{currency}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">This Week</p>
                <p className="text-lg text-red-600 mt-1">
                  {weekTotal.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{currency}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Highest</p>
                <p className="text-xs text-gray-900 mt-1 capitalize">
                  {highestCategory?.[0] || 'N/A'}
                </p>
                <p className="text-sm text-red-600">
                  {highestCategory?.[1]?.toLocaleString() || '0'} {currency}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Sync</p>
                <p className="text-lg text-yellow-600 mt-1">{pendingCount}</p>
                <p className="text-xs text-green-600">{syncedCount} synced</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
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
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grouped Expense List */}
      <div className="space-y-6">
        {Object.entries(groupedExpenses).map(([dateLabel, dayExpenses]) => (
          <div key={dateLabel}>
            <h2 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {dateLabel}
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {dayExpenses.length}
              </span>
              <span className="text-xs text-red-600">
                -{dayExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} {currency}
              </span>
            </h2>
            
            <div className="space-y-3">
              {dayExpenses.map((expense) => {
                const catInfo = getCategoryIcon(expense.category);
                const Icon = catInfo.icon;
                
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Link to={`/expenses/${expense.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            {/* Left Section */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`w-10 h-10 ${catInfo.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Badge className={`${catInfo.color} capitalize`}>
                                    {expense.category}
                                  </Badge>
                                  {getSyncStatusBadge(expense.synced)}
                                </div>
                                <p className="text-gray-900 mb-1">{expense.description}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(expense.date).toLocaleString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Right Section */}
                            <div className="text-right">
                              <div className="text-xs text-gray-600 mb-1">Amount</div>
                              <div className="text-xl text-red-600">
                                -{expense.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">{currency}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' || filterDate !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Track your first expense to get started!'}
              </p>
              {!searchTerm && filterCategory === 'all' && filterDate === 'all' && (
                <Link to="/expenses/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add First Expense
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}