import { useParams, useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Truck,
  Package,
  Receipt,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  FileText,
  DollarSign,
  Camera,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
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
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, user, isOnline, deleteExpense } = useApp();
  const [receiptPreviewOpen, setReceiptPreviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg text-gray-900 mb-2">Expense not found</h3>
            <p className="text-gray-500 mb-4">This expense may have been deleted or doesn't exist.</p>
            <Button onClick={() => navigate('/expenses')}>
              Back to Expenses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteExpense(expense.id);
      toast.success('Expense deleted (will sync when online)');
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to delete expense');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    if (expense.synced) {
      toast.error('Cannot edit synced expenses. Create an adjustment entry instead.');
      return;
    }
    navigate(`/expenses/${expense.id}/edit`);
  };

  const currency = user?.currency || 'XAF';

  const categoryIcons: Record<string, any> = {
    transport: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
    restock: { icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
    bills: { icon: Receipt, color: 'text-red-600', bg: 'bg-red-100' },
    utilities: { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    other: { icon: MoreHorizontal, color: 'text-gray-600', bg: 'bg-gray-100' },
  };

  const getCategoryInfo = (category: string) => {
    const normalizedCat = category.toLowerCase();
    if (categoryIcons[normalizedCat]) {
      return categoryIcons[normalizedCat];
    }
    return { icon: MoreHorizontal, color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const catInfo = getCategoryInfo(expense.category);
  const CategoryIcon = catInfo.icon;

  return (
    <div className="h-full flex flex-col space-y-6 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/expenses')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl text-gray-900">Expense Details</h1>
            <p className="text-sm text-gray-600">
              {new Date(expense.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {/* Sync Status Badge */}
        <div>
          {expense.synced ? (
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

      {/* Main Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Expense Information</CardTitle>
              <div className="text-xs text-gray-500">ID: {expense.id?.slice(0, 8)}</div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Category & Amount */}
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 ${catInfo.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <CategoryIcon className={`w-8 h-8 ${catInfo.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl text-gray-900 capitalize">{expense.category}</h3>
                  <Badge className={`${catInfo.bg} ${catInfo.color} border-current capitalize`}>
                    {expense.category}
                  </Badge>
                </div>
                <p className="text-gray-600">{expense.description}</p>
              </div>
            </div>

            {/* Amount Display */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-200">
              <div className="text-sm text-gray-600 mb-2">Total Amount</div>
              <div className="text-4xl text-red-600 mb-1">
                -{expense.amount.toLocaleString()} {currency}
              </div>
              <div className="text-sm text-gray-600">
                Business Expense
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date & Time</span>
                </div>
                <div className="text-sm text-gray-900">
                  {new Date(expense.date).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="p-4 bg-white border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount</span>
                </div>
                <div className="text-lg text-red-600">
                  {expense.amount.toLocaleString()} {currency}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-4">
              <h4 className="text-sm text-gray-600 uppercase tracking-wide mb-3">Description</h4>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{expense.description}</p>
                </div>
              </div>
            </div>

            {/* Receipt Photo */}
            <div className="border-t pt-4">
              <h4 className="text-sm text-gray-600 uppercase tracking-wide mb-3">Receipt Photo</h4>
              {expense.receipt ? (
                <div className="relative group">
                  <img 
                    src={expense.receipt} 
                    alt="Receipt" 
                    className="w-full h-auto rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => setReceiptPreviewOpen(true)}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setReceiptPreviewOpen(true)}
                  >
                    <Maximize2 className="w-4 h-4" />
                    View Full Size
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">Click to view full size</p>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No receipt attached</p>
                </div>
              )}
            </div>

            {/* Sync Information */}
            <div className="border-t pt-4">
              <h4 className="text-sm text-gray-600 uppercase tracking-wide mb-3">Sync Status</h4>
              <div className={`p-4 rounded-lg ${
                expense.synced 
                  ? 'bg-green-50 border border-green-200' 
                  : isOnline 
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {expense.synced ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-900">Successfully synced to cloud</span>
                    </>
                  ) : isOnline ? (
                    <>
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-yellow-900">Syncing to cloud...</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-900">Pending sync (offline)</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  {expense.synced 
                    ? 'This expense has been saved to the cloud and is backed up.'
                    : 'Changes are saved locally and will sync when connection is restored.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              disabled={expense.synced}
              className="flex-1 gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Expense
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Expense
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The expense record will be permanently removed
                    {!expense.synced && ' from the sync queue'}.
                    {expense.synced && ' and a reversal entry will be created'}.
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
          </div>

          {expense.synced && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800 border border-yellow-200">
              <strong>Note:</strong> This expense has been synced. Editing is disabled. To make corrections, create a new adjustment entry.
            </div>
          )}

          {!expense.synced && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-200">
              <strong>Tip:</strong> This expense hasn't been synced yet. You can still edit or delete it freely.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Preview Dialog */}
      <Dialog open={receiptPreviewOpen} onOpenChange={setReceiptPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {expense.receipt && (
              <img 
                src={expense.receipt} 
                alt="Receipt Full Size" 
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}