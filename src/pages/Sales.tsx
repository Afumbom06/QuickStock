import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { 
  Plus, 
  Search, 
  Filter,
  Wallet,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Calendar,
  Receipt
} from 'lucide-react';
import { Input } from '../components/ui/input';
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
import { SaleReceipt, SaleReceiptData } from '../components/SaleReceipt';

export function Sales() {
  const { sales, t, user, isOnline, refreshData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [receiptDialog, setReceiptDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleReceiptData | null>(null);

  const handleViewReceipt = (e: React.MouseEvent, sale: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSale(sale);
    setReceiptDialog(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const filteredSales = sales.filter(sale => {
    // Search filter
    const matchesSearch = sale.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerNote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    if (filterDate === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = sale.date.startsWith(today);
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(sale.date) >= weekAgo;
    } else if (filterDate === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(sale.date) >= monthAgo;
    }

    // Payment filter
    const matchesPayment = filterPayment === 'all' || sale.paymentType === filterPayment;

    return matchesSearch && matchesDate && matchesPayment;
  });

  const currency = user?.currency || 'XAF';

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const syncedCount = filteredSales.filter(s => s.synced).length;
  const pendingCount = filteredSales.filter(s => !s.synced).length;

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'cash': return <Wallet className="w-4 h-4" />;
      case 'momo': return <Smartphone className="w-4 h-4" />;
      case 'credit': return <CreditCard className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getSyncStatusBadge = (synced?: boolean) => {
    if (synced) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Synced
        </Badge>
      );
    }
    if (isOnline) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1">
          <Clock className="w-3 h-3" />
          Syncing...
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200 gap-1">
        <AlertCircle className="w-3 h-3" />
        Pending
      </Badge>
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full flex flex-col space-y-4 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">{t('salesHistory')}</h1>
          <p className="text-gray-600">
            {filteredSales.length} sales · {totalRevenue.toLocaleString()} {currency} total
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
          <Link to="/sales/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl text-gray-900 mt-1">
                  {totalRevenue.toLocaleString()} {currency}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Synced Sales</p>
                <p className="text-xl text-green-600 mt-1">{syncedCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Sync</p>
                <p className="text-xl text-yellow-600 mt-1">{pendingCount}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by item, customer, or note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

            {/* Payment Filter */}
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="momo">MoMo</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-3 overflow-y-auto"
      >
        {filteredSales.map((sale) => (
          <motion.div key={sale.id} variants={item}>
            <Link to={`/sales/${sale.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        {/* Payment Icon */}
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          {getPaymentIcon(sale.paymentType)}
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-gray-900 truncate">{sale.itemName}</h3>
                            {getSyncStatusBadge(sale.synced)}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-4 flex-wrap">
                              <span>Qty: {sale.quantity} × {sale.price.toLocaleString()} {currency}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {sale.paymentType}
                              </Badge>
                            </div>
                            
                            {sale.customerName && (
                              <div className="text-gray-500">
                                Customer: {sale.customerName}
                              </div>
                            )}
                            
                            {sale.customerNote && (
                              <div className="text-gray-500 italic line-clamp-1">
                                Note: {sale.customerNote}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(sale.date).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Total & Receipt Button */}
                    <div className="flex items-center gap-3">
                      <div className="text-right sm:min-w-[120px]">
                        <div className="text-xs text-gray-600 mb-1">Total</div>
                        <div className="text-2xl text-gray-900">
                          {sale.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{currency}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => handleViewReceipt(e, sale)}
                        className="flex-shrink-0 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                        title="View Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {filteredSales.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg text-gray-900 mb-2">No sales found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterDate !== 'all' || filterPayment !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add your first sale to get started!'}
              </p>
              {!searchTerm && filterDate === 'all' && filterPayment === 'all' && (
                <Link to="/sales/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add First Sale
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Receipt Dialog */}
      <SaleReceipt
        open={receiptDialog}
        onOpenChange={setReceiptDialog}
        saleData={selectedSale}
      />
    </div>
  );
}