import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  ArrowLeft, 
  Check, 
  User,
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function AddDebt() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customers, debts, addDebt, user, isOnline } = useApp();
  const [loading, setLoading] = useState(false);

  const customer = customerId ? customers.find(c => c.id === customerId) : null;

  const [formData, setFormData] = useState({
    customerId: customerId || '',
    type: 'credit' as 'credit' | 'payment',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    collectedAmount: '',
  });

  const [errors, setErrors] = useState({
    customerId: '',
    amount: '',
  });

  const currency = user?.currency || 'XAF';

  // Calculate current balance
  const currentBalance = formData.customerId
    ? debts
        .filter(d => d.customerId === formData.customerId)
        .reduce((sum, d) => {
          return sum + (d.type === 'credit' ? d.amount : -d.amount);
        }, 0)
    : 0;

  const newBalance = formData.amount
    ? currentBalance + (formData.type === 'credit' ? parseFloat(formData.amount) : -parseFloat(formData.amount))
    : currentBalance;

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'customerId':
        if (!value) return 'Please select a customer';
        return '';
      case 'amount':
        const num = parseFloat(value);
        if (!value || isNaN(num) || num <= 0) return 'Amount must be greater than 0';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const customerError = validateField('customerId', formData.customerId);
    const amountError = validateField('amount', formData.amount);

    if (customerError || amountError) {
      setErrors({
        customerId: customerError,
        amount: amountError,
      });
      return;
    }

    setLoading(true);
    try {
      await addDebt({
        customerId: formData.customerId,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        date: new Date(formData.date),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        collectedAmount: formData.collectedAmount ? parseFloat(formData.collectedAmount) : undefined,
      });

      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      toast.success(
        formData.type === 'credit' ? 'Debt recorded!' : 'Payment recorded!',
        {
          description: `${formData.amount} ${currency} ${formData.type === 'credit' ? 'debt added to' : 'payment from'} ${selectedCustomer?.name}`
        }
      );
      
      navigate(`/customers/${formData.customerId}`);
    } catch (error) {
      toast.error('Failed to record transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(customerId ? `/customers/${customerId}` : '/customers')} 
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900">Add Transaction</h1>
          <p className="text-sm text-gray-600">Record a debt or payment</p>
        </div>
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <strong>Offline Mode:</strong> Transaction will be saved locally and synced when online
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 flex-1">{/* Form */}
        <div className="lg:col-span-2 space-y-4">{/* Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={formData.type === 'credit' ? 'default' : 'outline'}
                  className={`h-20 flex flex-col gap-2 ${
                    formData.type === 'credit' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'hover:border-red-500'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'credit' }))}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>Add Debt (Credit)</span>
                </Button>

                <Button
                  type="button"
                  variant={formData.type === 'payment' ? 'default' : 'outline'}
                  className={`h-20 flex flex-col gap-2 ${
                    formData.type === 'payment' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'hover:border-green-500'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'payment' }))}
                >
                  <TrendingDown className="w-6 h-6" />
                  <span>Record Payment</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Selection */}
              {!customerId && (
                <div>
                  <Label htmlFor="customer">Select Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger className={`mt-2 ${errors.customerId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Choose a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {customer.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && (
                    <p className="text-xs text-red-600 mt-1">{errors.customerId}</p>
                  )}
                </div>
              )}

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount ({currency}) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  onBlur={() => handleBlur('amount')}
                  className={`mt-2 ${errors.amount ? 'border-red-500' : ''}`}
                  autoFocus
                />
                {errors.amount && (
                  <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">
                  Description / Purpose
                  <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={formData.type === 'credit' 
                    ? 'e.g., Bought groceries, Rent advance' 
                    : 'e.g., Cash payment, Mobile money'}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 min-h-[80px]"
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date" className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  Transaction Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-2"
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              {/* Due Date - Only for Credits */}
              {formData.type === 'credit' && (
                <div>
                  <Label htmlFor="dueDate" className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    Due Date (When to pay)
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-2"
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set when this debt should be paid back
                  </p>
                </div>
              )}

              {/* Collected Amount - Only for Payments */}
              {formData.type === 'payment' && (
                <div>
                  <Label htmlFor="collectedAmount" className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Amount Collected ({currency})
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </Label>
                  <Input
                    id="collectedAmount"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.collectedAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectedAmount: e.target.value }))}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Partial payment amount if different from full amount
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Balance Preview */}
        <div className="space-y-4">
          {/* Current Customer Info */}
          {(customer || formData.customerId) && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-gray-900">
                      {customer?.name || customers.find(c => c.id === formData.customerId)?.name}
                    </p>
                    {(customer?.phone || customers.find(c => c.id === formData.customerId)?.phone) && (
                      <p className="text-xs text-gray-600">
                        {customer?.phone || customers.find(c => c.id === formData.customerId)?.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Balance Calculation */}
          {formData.customerId && (
            <Card className={`border-2 ${
              formData.type === 'credit' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
            }`}>
              <CardHeader>
                <CardTitle className="text-sm">Balance Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Balance */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Balance</p>
                  <p className={`text-2xl ${currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {currentBalance.toLocaleString()} {currency}
                  </p>
                </div>

                {/* Transaction Amount */}
                {formData.amount && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-600 mb-1">
                      {formData.type === 'credit' ? 'Adding Debt' : 'Payment Amount'}
                    </p>
                    <p className={`text-xl ${formData.type === 'credit' ? 'text-red-600' : 'text-green-600'}`}>
                      {formData.type === 'credit' ? '+' : '-'}{parseFloat(formData.amount).toLocaleString()} {currency}
                    </p>
                  </div>
                )}

                {/* New Balance */}
                {formData.amount && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-600 mb-1">New Balance</p>
                    <p className={`text-3xl ${newBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {newBalance.toLocaleString()} {currency}
                    </p>
                    {newBalance === 0 && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Debt cleared!
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-sm text-gray-900 mb-2">💡 Quick Tips</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Credit:</strong> Customer owes you money</li>
                <li>• <strong>Payment:</strong> Customer pays you back</li>
                <li>• Balance updates automatically</li>
                <li>• All dates can be edited later</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(customerId ? `/customers/${customerId}` : '/customers')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.customerId || !formData.amount}
              className={`flex-1 gap-2 ${
                formData.type === 'credit' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <Check className="w-4 h-4" />
              {loading 
                ? 'Recording...' 
                : formData.type === 'credit' 
                  ? 'Add Debt' 
                  : 'Record Payment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}