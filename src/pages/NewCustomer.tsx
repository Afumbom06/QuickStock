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
  User,
  Phone,
  FileText,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

export function NewCustomer() {
  const navigate = useNavigate();
  const { addCustomer, isOnline } = useApp();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  });

  const [errors, setErrors] = useState({
    name: '',
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Customer name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
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
    
    const nameError = validateField('name', formData.name);

    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    setLoading(true);
    try {
      await addCustomer({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      toast.success(
        isOnline 
          ? 'Customer added & synced!' 
          : 'Customer saved (will sync when online)',
        {
          description: `${formData.name} has been added to your customer book`
        }
      );
      navigate('/customers');
    } catch (error) {
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/customers')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900">Add New Customer</h1>
          <p className="text-sm text-gray-600">Create a customer account to track debts</p>
        </div>
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <strong>Offline Mode:</strong> Customer will be saved locally and synced when you're back online
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 flex-1">{/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Customer Name */}
              <div>
                <Label htmlFor="name" className="flex items-center gap-1">
                  Customer Name *
                  <span className="text-xs text-gray-500">(Required)</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., John Doe, Mary's Shop"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => handleBlur('name')}
                  className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number
                  <span className="text-xs text-gray-500">(Optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +237 6XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for WhatsApp reminders and calling
                </p>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Notes
                  <span className="text-xs text-gray-500">(Optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Regular customer, prefers credit on Mondays"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-2 min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add any important details about this customer
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Card */}
        {formData.name && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-gray-900">{formData.name}</p>
                    {formData.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {formData.phone}
                      </p>
                    )}
                    {formData.notes && (
                      <p className="text-xs text-gray-500 mt-2">
                        📝 {formData.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Current Balance: <span className="text-green-600">0 XAF</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/customers')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name.trim()}
                className="flex-1 gap-2 bg-blue-900 hover:bg-blue-800"
              >
                <Check className="w-4 h-4" />
                {loading ? 'Adding Customer...' : 'Add Customer'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-900 mb-2">💡 Tips</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Add phone number to enable WhatsApp debt reminders</li>
              <li>• Use notes to remember customer preferences</li>
              <li>• You can add debts and payments after creating the customer</li>
              <li>• All data syncs automatically when online</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}