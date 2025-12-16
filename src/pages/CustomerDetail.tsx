import { useParams, useNavigate, Link } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft,
  Plus,
  Minus,
  User,
  Phone,
  DollarSign,
  Edit,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Calendar,
  FileText
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, debts, deleteCustomer, user, isOnline } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'payment'>('all');

  const customer = customers.find(c => c.id === id);
  const customerDebts = debts.filter(d => d.customerId === id);

  const currency = user?.currency || 'XAF';

  if (!customer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg text-gray-900 mb-2">Customer not found</h3>
            <p className="text-gray-500 mb-4">This customer may have been deleted.</p>
            <Button onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate balance
  const totalDebt = customerDebts
    .filter(d => d.type === 'credit')
    .reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = customerDebts
    .filter(d => d.type === 'payment')
    .reduce((sum, d) => sum + d.amount, 0);
  const balance = totalDebt - totalPaid;

  // Filter transactions
  const filteredTransactions = customerDebts.filter(d => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Check for old debts
  const hasOldDebt = balance > 0 && customerDebts.length > 0 && 
    (new Date().getTime() - new Date(customerDebts[customerDebts.length - 1].date).getTime()) > 7 * 24 * 60 * 60 * 1000;

  const handleDelete = async () => {
    try {
      await deleteCustomer(id!);
      toast.success('Customer deleted');
      navigate('/customers');
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const handleWhatsAppReminder = () => {
    if (!customer.phone) {
      toast.error('No phone number saved for this customer');
      return;
    }

    const message = `Hello ${customer.name}, you have an outstanding balance of ${balance.toLocaleString()} ${currency}. Please make a payment when convenient. Thank you!`;
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleCall = () => {
    if (!customer.phone) {
      toast.error('No phone number saved for this customer');
      return;
    }
    window.location.href = `tel:${customer.phone}`;
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl text-gray-900">Customer Details</h1>
          <p className="text-sm text-gray-600">View and manage customer transactions</p>
        </div>
      </div>

      {/* Customer Profile Card */}
      <Card className={`border-2 ${balance > 0 ? 'border-red-300' : 'border-green-300'}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              balance > 0 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <User className={`w-10 h-10 ${balance > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>

            {/* Customer Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-1">{customer.name}</h2>
                  {customer.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </p>
                  )}
                </div>

                {/* Balance */}
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Current Balance</p>
                  <p className={`text-4xl ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {balance.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{currency}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={balance > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
                  {balance > 0 ? (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Owes {balance.toLocaleString()} {currency}
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Cleared
                    </>
                  )}
                </Badge>

                {!customer.synced && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Sync
                  </Badge>
                )}

                {hasOldDebt && (
                  <Badge className="bg-orange-100 text-orange-700">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Debt &gt; 1 week
                  </Badge>
                )}

                <Badge variant="outline">
                  {customerDebts.length} transactions
                </Badge>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {customer.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to={`/debts/add/${id}`}>
          <Button className="w-full h-auto py-4 flex-col gap-2 bg-red-600 hover:bg-red-700">
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Debt</span>
          </Button>
        </Link>

        <Link to={`/debts/add/${id}`}>
          <Button className="w-full h-auto py-4 flex-col gap-2 bg-green-600 hover:bg-green-700">
            <Minus className="w-5 h-5" />
            <span className="text-sm">Add Payment</span>
          </Button>
        </Link>

        {customer.phone && (
          <>
            <Button
              onClick={handleWhatsAppReminder}
              variant="outline"
              className="w-full h-auto py-4 flex-col gap-2 hover:bg-green-50"
              disabled={balance === 0}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">WhatsApp</span>
            </Button>

            <Button
              onClick={handleCall}
              variant="outline"
              className="w-full h-auto py-4 flex-col gap-2 hover:bg-blue-50"
            >
              <Phone className="w-5 h-5" />
              <span className="text-sm">Call</span>
            </Button>
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-600 mb-1">Total Debt</p>
            <p className="text-2xl text-red-600">{totalDebt.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{currency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-600 mb-1">Total Paid</p>
            <p className="text-2xl text-green-600">{totalPaid.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{currency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-600 mb-1">Transactions</p>
            <p className="text-2xl text-gray-900">{customerDebts.length}</p>
            <p className="text-xs text-gray-500">total</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Transaction History
            </CardTitle>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterType === 'credit' ? 'default' : 'outline'}
                onClick={() => setFilterType('credit')}
                className={filterType === 'credit' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Debts
              </Button>
              <Button
                size="sm"
                variant={filterType === 'payment' ? 'default' : 'outline'}
                onClick={() => setFilterType('payment')}
                className={filterType === 'payment' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Payments
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => {
                const runningBalance = customerDebts
                  .filter(d => new Date(d.date) <= new Date(transaction.date))
                  .reduce((sum, d) => sum + (d.type === 'credit' ? d.amount : -d.amount), 0);

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                      transaction.type === 'credit' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' ? 'bg-red-200' : 'bg-green-200'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <TrendingUp className={`w-6 h-6 text-red-700`} />
                      ) : (
                        <TrendingDown className={`w-6 h-6 text-green-700`} />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-lg ${
                              transaction.type === 'credit' ? 'text-red-900' : 'text-green-900'
                            }`}>
                              {transaction.type === 'credit' ? 'Debt Added' : 'Payment Received'}
                            </h4>
                            {!transaction.synced && (
                              <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {format(new Date(transaction.date), 'EEEE, MMMM d, yyyy • HH:mm')}
                          </p>
                        </div>

                        <p className={`text-2xl ${
                          transaction.type === 'credit' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} {currency}
                        </p>
                      </div>

                      {transaction.description && (
                        <div className="p-2 bg-white rounded mb-2">
                          <p className="text-sm text-gray-700">
                            📝 {transaction.description}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Balance after transaction:</span>
                        <span className={runningBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                          {runningBalance.toLocaleString()} {currency}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                {filterType === 'all' 
                  ? 'No transactions yet'
                  : `No ${filterType === 'credit' ? 'debts' : 'payments'} recorded`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Customer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this customer?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {customer.name} and all their transaction history.
                  This action cannot be undone.
                  {balance > 0 && (
                    <p className="mt-2 text-red-600">
                      ⚠️ Warning: This customer still owes {balance.toLocaleString()} {currency}
                    </p>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete Customer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}