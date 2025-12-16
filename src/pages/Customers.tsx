import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';
import { 
  Plus, 
  Search,
  User,
  Phone,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users as UsersIcon,
  Filter,
  TrendingUp,
  AlertTriangle,
  TrendingDown,
  Check,
  MessageCircle
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function Customers() {
  const { customers, debts, user, isOnline } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'owing' | 'cleared'>('all');

  const currency = user?.currency || 'XAF';

  // Calculate customer balances
  const customersWithBalances = useMemo(() => {
    return customers.map(customer => {
      const customerDebts = debts.filter(d => d.customerId === customer.id);
      const totalDebt = customerDebts
        .filter(d => d.type === 'credit')
        .reduce((sum, d) => sum + d.amount, 0);
      const totalPaid = customerDebts
        .filter(d => d.type === 'payment')
        .reduce((sum, d) => sum + d.amount, 0);
      const balance = totalDebt - totalPaid;
      
      const lastTransaction = customerDebts.length > 0
        ? new Date(Math.max(...customerDebts.map(d => new Date(d.date).getTime())))
        : null;

      return {
        ...customer,
        balance,
        lastTransaction,
        transactionCount: customerDebts.length
      };
    });
  }, [customers, debts]);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customersWithBalances.filter(customer => {
      // Search filter
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      // Balance filter
      let matchesFilter = true;
      if (filter === 'owing') {
        matchesFilter = customer.balance > 0;
      } else if (filter === 'cleared') {
        matchesFilter = customer.balance === 0;
      }

      return matchesSearch && matchesFilter;
    }).sort((a, b) => b.balance - a.balance); // Sort by balance descending
  }, [customersWithBalances, searchTerm, filter]);

  // Calculate stats
  const totalOwing = customersWithBalances.filter(c => c.balance > 0).length;
  const totalCleared = customersWithBalances.filter(c => c.balance === 0).length;
  const totalDebtAmount = customersWithBalances.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const unsyncedCount = customers.filter(c => !c.synced).length;

  const getBalanceStatus = (balance: number) => {
    if (balance === 0) {
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2, label: 'Cleared' };
    } else if (balance > 0) {
      return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, label: 'Owes' };
    }
    return { color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle2, label: 'N/A' };
  };

  const navigate = useNavigate();

  const calculateBalance = (customerId: string) => {
    const customerDebts = debts.filter(d => d.customerId === customerId);
    const totalDebt = customerDebts
      .filter(d => d.type === 'credit')
      .reduce((sum, d) => sum + d.amount, 0);
    const totalPaid = customerDebts
      .filter(d => d.type === 'payment')
      .reduce((sum, d) => sum + d.amount, 0);
    return totalDebt - totalPaid;
  };

  const getLastDebt = (customerId: string) => {
    const customerDebts = debts.filter(d => d.customerId === customerId);
    if (customerDebts.length === 0) return null;
    return customerDebts.reduce((latest, current) => {
      return new Date(latest.date) > new Date(current.date) ? latest : current;
    });
  };

  const hasOldUnpaidDebt = (customerId: string) => {
    const customerDebts = debts.filter(d => d.customerId === customerId);
    const lastDebt = getLastDebt(customerId);
    if (!lastDebt) return false;
    return new Date().getTime() - new Date(lastDebt.date).getTime() > 7 * 24 * 60 * 60 * 1000;
  };

  const sendWhatsAppReminder = (customer: any, balance: number) => {
    const message = `Hello ${customer.name}, this is a reminder that you owe us ${balance.toLocaleString()} ${currency}. Please make the payment at your earliest convenience.`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${customer.phone}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1 flex items-center gap-2">
            <UsersIcon className="w-7 h-7" />
            Customer Book
          </h1>
          <p className="text-gray-600">{customers.length} customers · {totalOwing} owing</p>
        </div>
        <Link to="/customers/new">
          <Button className="gap-2 bg-blue-900 hover:bg-blue-800">
            <Plus className="w-5 h-5" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Customers</p>
                <p className="text-2xl text-gray-900 mt-1">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Owing</p>
                <p className="text-2xl text-red-600 mt-1">{totalOwing}</p>
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
                <p className="text-xs text-gray-600">Total Debt</p>
                <p className="text-2xl text-orange-600 mt-1">{(totalDebtAmount / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">{currency}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Cleared</p>
                <p className="text-2xl text-green-600 mt-1">{totalCleared}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="gap-1"
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
              <Button
                variant={filter === 'owing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('owing')}
                className="gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                Owing
              </Button>
              <Button
                variant={filter === 'cleared' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('cleared')}
                className="gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Cleared
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Indicator */}
      {!isOnline && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-3">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <strong>⚠️ Offline Mode</strong> - All data loaded from device storage
            </p>
          </CardContent>
        </Card>
      )}

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {searchTerm 
                  ? 'No customers found matching your search' 
                  : 'No customers yet. Add your first customer!'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm text-gray-600">Customer Name</th>
                      <th className="text-left px-6 py-4 text-sm text-gray-600">Phone</th>
                      <th className="text-right px-6 py-4 text-sm text-gray-600">Amount Owed</th>
                      <th className="text-center px-6 py-4 text-sm text-gray-600">Status</th>
                      <th className="text-center px-6 py-4 text-sm text-gray-600">Last Transaction</th>
                      <th className="text-center px-6 py-4 text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCustomers.map((customer, index) => {
                      const balance = calculateBalance(customer.id);
                      const lastDebt = getLastDebt(customer.id);
                      const hasOldDebt = hasOldUnpaidDebt(customer.id);

                      return (
                        <motion.tr
                          key={customer.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                        >
                          {/* Customer Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-gray-900">{customer.name}</p>
                                {customer.notes && (
                                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                    {customer.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-6 py-4">
                            {customer.phone ? (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{customer.phone}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No phone</span>
                            )}
                          </td>

                          {/* Amount Owed */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-lg ${
                                balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {balance.toLocaleString()} {currency}
                              </span>
                              {hasOldDebt && balance > 0 && (
                                <span className="text-xs text-orange-600 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Overdue
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              {balance > 0 ? (
                                <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 inline-flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Owing
                                </span>
                              ) : balance < 0 ? (
                                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 inline-flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  Overpaid
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Cleared
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Last Transaction */}
                          <td className="px-6 py-4 text-center">
                            {lastDebt ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-sm text-gray-700">
                                  {format(new Date(lastDebt.date), 'MMM dd, yyyy')}
                                </span>
                                <span className={`text-xs ${
                                  lastDebt.type === 'credit' ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {lastDebt.type === 'credit' ? '+' : '-'}{lastDebt.amount.toLocaleString()} {currency}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">No transactions</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/debts/add/${customer.id}`);
                                }}
                                className="gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </Button>
                              {customer.phone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendWhatsAppReminder(customer, balance);
                                  }}
                                  className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y">
                {filteredCustomers.map((customer, index) => {
                  const balance = calculateBalance(customer.id);
                  const lastDebt = getLastDebt(customer.id);
                  const hasOldDebt = hasOldUnpaidDebt(customer.id);

                  return (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <div className="space-y-3">
                        {/* Customer Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 truncate">{customer.name}</p>
                              {customer.phone && (
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {customer.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            {balance > 0 ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 inline-flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Owing
                              </span>
                            ) : balance < 0 ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 inline-flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                Overpaid
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Cleared
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount Owed - Prominent */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Amount Owed:</span>
                          <div className="text-right">
                            <span className={`text-xl ${
                              balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {balance.toLocaleString()} {currency}
                            </span>
                            {hasOldDebt && balance > 0 && (
                              <p className="text-xs text-orange-600 flex items-center gap-1 justify-end mt-0.5">
                                <AlertTriangle className="w-3 h-3" />
                                Overdue
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Last Transaction */}
                        {lastDebt && (
                          <div className="text-sm text-gray-600 flex items-center justify-between">
                            <span>Last transaction:</span>
                            <div className="text-right">
                              <p className="text-gray-700">
                                {format(new Date(lastDebt.date), 'MMM dd, yyyy')}
                              </p>
                              <p className={`text-xs ${
                                lastDebt.type === 'credit' ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {lastDebt.type === 'credit' ? '+' : '-'}{lastDebt.amount.toLocaleString()} {currency}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/debts/add/${customer.id}`);
                            }}
                            className="flex-1 gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Transaction
                          </Button>
                          {customer.phone && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendWhatsAppReminder(customer, balance);
                              }}
                              className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Remind
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}