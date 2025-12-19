import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  ArrowLeft, 
  Check, 
  Truck, 
  Package, 
  Receipt, 
  Zap, 
  MoreHorizontal,
  Calendar as CalendarIcon,
  Camera,
  RotateCcw,
  AlertCircle,
  X,
  Upload,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

type ExpenseCategory = 'transport' | 'restock' | 'bills' | 'utilities' | 'other';

export function NewExpense() {
  const navigate = useNavigate();
  const { addExpense, t, user, isOnline } = useApp();
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptPreviewOpen, setReceiptPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: '' as ExpenseCategory | '',
    customCategory: '',
    amount: '',
    description: '',
    date: new Date(),
    receipt: '' as string,
  });

  const categories = [
    { value: 'transport', label: 'Transport', icon: Truck, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'restock', label: 'Restock', icon: Package, color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'bills', label: 'Bills', icon: Receipt, color: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'utilities', label: 'Utilities', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'other', label: 'Other', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-700 border-gray-300' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    if (!formData.category || amount <= 0 || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.category === 'other' && !formData.customCategory.trim()) {
      toast.error('Please specify the custom category');
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        category: formData.category === 'other' && formData.customCategory 
          ? formData.customCategory 
          : formData.category,
        amount: amount,
        description: formData.description,
        date: formData.date.toISOString(),
        receipt: formData.receipt,
      });

      toast.success(isOnline ? 'Expense added & synced!' : 'Expense saved (will sync when online)');
      
      if (addAnother) {
        // Reset form but keep category
        const keepCategory = formData.category;
        setFormData({
          category: keepCategory,
          customCategory: '',
          amount: '',
          description: '',
          date: new Date(),
          receipt: '',
        });
        setReceiptPreview(null);
        setAddAnother(false);
      } else {
        navigate('/expenses');
      }
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      category: '',
      customCategory: '',
      amount: '',
      description: '',
      date: new Date(),
      receipt: '',
    });
    setReceiptPreview(null);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, receipt: base64String }));
      setReceiptPreview(base64String);
      toast.success('Receipt uploaded!');
    };
    reader.onerror = () => {
      toast.error('Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setFormData(prev => ({ ...prev, receipt: '' }));
    setReceiptPreview(null);
    toast.info('Receipt removed');
  };

  const currency = user?.currency || 'XAF';
  const amount = parseFloat(formData.amount) || 0;

  return (
    <div className="h-full flex flex-col space-y-6 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/expenses')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900">{t('newExpense')}</h1>
          <p className="text-sm text-gray-600">Track a new business expense</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Selection - Left Side */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Category *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.value;
                  return (
                    <motion.button
                      key={cat.value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        category: cat.value as ExpenseCategory,
                        customCategory: '' 
                      }))}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? cat.color + ' border-current shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-sm">{cat.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Category Input */}
              {formData.category === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <Label>Specify Category *</Label>
                  <Input
                    placeholder="e.g., Marketing, Rent..."
                    value={formData.customCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                    className="mt-2"
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expense Details - Right Side */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Input */}
              <div>
                <Label>Amount ({currency}) *</Label>
                <div className="relative mt-2">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="text-2xl h-14 pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                    {currency}
                  </div>
                </div>
                {amount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {amount.toLocaleString()} {currency}
                  </p>
                )}
                {parseFloat(formData.amount) < 0 && (
                  <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Amount cannot be negative</span>
                  </div>
                )}
              </div>

              {/* Date Selector */}
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-2">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {formData.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Description */}
              <div>
                <Label>Description *</Label>
                <Textarea
                  placeholder="What was this expense for?"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Receipt Photo */}
              <div>
                <Label className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  Receipt Photo (Optional)
                </Label>
                {receiptPreview ? (
                  <div className="mt-2">
                    <div className="relative group">
                      <img 
                        src={receiptPreview} 
                        alt="Receipt preview" 
                        className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => setReceiptPreviewOpen(true)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                          onClick={() => setReceiptPreviewOpen(true)}
                        >
                          <Maximize2 className="w-3 h-3" />
                          View Full Size
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => setReceiptPreviewOpen(true)}
                      >
                        <Maximize2 className="w-3 h-3" />
                        Preview
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={removeReceipt}
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">Click to view full size</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <label htmlFor="receipt-upload">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload receipt</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    </label>
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {formData.category && amount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Expense</div>
                  <div className="text-3xl text-red-600 mb-2">
                    {amount.toLocaleString()} {currency}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formData.category === 'other' && formData.customCategory 
                      ? formData.customCategory 
                      : categories.find(c => c.value === formData.category)?.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading || !formData.category || amount <= 0 || !formData.description || parseFloat(formData.amount) < 0}
                className="flex-1 gap-2 h-12"
              >
                <Check className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Expense'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAddAnother(true);
                handleSubmit(new Event('submit') as any);
              }}
              disabled={loading || !formData.category || amount <= 0 || !formData.description}
              className="w-full"
            >
              Save & Add Another
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Receipt Preview Dialog */}
      <Dialog open={receiptPreviewOpen} onOpenChange={setReceiptPreviewOpen}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src={receiptPreview || ''} 
              alt="Receipt preview" 
              className="w-full h-auto rounded-lg border-2 border-gray-200"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}