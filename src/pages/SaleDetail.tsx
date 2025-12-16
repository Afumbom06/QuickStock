import { useParams, useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Wallet,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  User,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
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

export function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sales, user, isOnline, deleteSale } = useApp();

  const sale = sales.find(s => s.id === id);

  if (!sale) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg text-gray-900 mb-2">Sale not found</h3>
            <p className="text-gray-500 mb-4">This sale may have been deleted or doesn't exist.</p>
            <Button onClick={() => navigate('/sales')}>
              Back to Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteSale(sale.id);
      toast.success(isOnline ? 'Sale deleted & synced!' : 'Sale deleted (will sync when online)');
      navigate('/sales');
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Failed to delete sale');
    }
  };

  const handleEdit = () => {
    if (sale.synced) {
      toast.error('Cannot edit synced sales. Create a correction entry instead.');
      return;
    }
    navigate(`/sales/${sale.id}/edit`);
  };

  const currency = user?.currency || 'XAF';

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'cash': return { icon: Wallet, color: 'text-green-600', bg: 'bg-green-100' };
      case 'momo': return { icon: Smartphone, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'credit': return { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' };
      default: return { icon: Wallet, color: 'text-green-600', bg: 'bg-green-100' };
    }
  };

  const paymentInfo = getPaymentIcon(sale.paymentType);
  const PaymentIcon = paymentInfo.icon;

  return (
    <div className="h-full flex flex-col space-y-4 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sales')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl text-gray-900">Sale Details</h1>
            <p className="text-sm text-gray-600">
              {new Date(sale.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {/* Sync Status Badge */}
        <div className="flex-shrink-0">
          {sale.synced ? (
            <Badge className="bg-green-100 text-green-700 border-green-200 gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Synced
            </Badge>
          ) : isOnline ? (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-2">
              <Clock className="w-4 h-4" />
              Syncing...
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-700 border-gray-200 gap-2">
              <AlertCircle className="w-4 h-4" />
              Pending Sync
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-4 flex-1">
        {/* Main Details Card - Takes 2 columns */}
        <div className="lg:col-span-2 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction Information</CardTitle>
                  <div className="text-xs text-gray-500">ID: {sale.id?.slice(0, 8)}</div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Item Details */}
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 ${paymentInfo.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <PaymentIcon className={`w-8 h-8 ${paymentInfo.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl text-gray-900 mb-2">{sale.itemName}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Quantity: <strong>{sale.quantity}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Unit Price: <strong>{sale.price.toLocaleString()} {currency}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price per unit</span>
                    <span className="text-lg text-gray-900">{sale.price.toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span className="text-lg text-gray-900">× {sale.quantity}</span>
                  </div>
                  <div className="border-t-2 border-blue-300 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-gray-900">Total Amount</span>
                      <span className="text-3xl text-blue-600">{sale.total.toLocaleString()} {currency}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border-2 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <PaymentIcon className="w-4 h-4" />
                      <span>Payment Method</span>
                    </div>
                    <div className="text-xl text-gray-900 capitalize">{sale.paymentType}</div>
                  </div>
                  <div className="p-4 bg-white border-2 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date & Time</span>
                    </div>
                    <div className="text-sm text-gray-900">
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

                {/* Customer Information */}
                {(sale.customerName || sale.customerNote) && (
                  <div className="border-t pt-6 space-y-3">
                    <h4 className="text-sm text-gray-600 uppercase tracking-wide">Customer Information</h4>
                    
                    {sale.customerName && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-blue-600 mb-1">Customer Name</div>
                          <div className="text-base text-gray-900">{sale.customerName}</div>
                        </div>
                      </div>
                    )}

                    {sale.customerNote && (
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-600 mb-1">Notes</div>
                          <div className="text-sm text-gray-900">{sale.customerNote}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions Sidebar - Takes 1 column */}
        <div className="flex flex-col space-y-4">
          {/* Quick Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-50 to-white">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Total Sale</div>
                  <div className="text-3xl text-blue-600">{sale.total.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-1">{currency}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Qty</div>
                    <div className="text-xl text-gray-900">{sale.quantity}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-xs text-gray-600 mb-1">Unit</div>
                    <div className="text-xl text-gray-900">{sale.price}</div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border-2 ${paymentInfo.bg} border-current`}>
                  <div className="flex items-center justify-center gap-2">
                    <PaymentIcon className={`w-5 h-5 ${paymentInfo.color}`} />
                    <span className={`capitalize ${paymentInfo.color}`}>{sale.paymentType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  disabled={sale.synced}
                  className="w-full gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Sale
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Sale
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this sale?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The sale record will be permanently removed
                        {!sale.synced && ' from the sync queue'}.
                        {sale.synced && ' and a reversal entry will be created'}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {sale.synced && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800 border border-yellow-200">
                    <strong>Note:</strong> This sale has been synced. Editing is disabled. To make corrections, create a new adjustment entry.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}