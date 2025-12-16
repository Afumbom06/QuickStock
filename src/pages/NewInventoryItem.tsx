import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  Check, 
  Camera, 
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function NewInventoryItem() {
  const navigate = useNavigate();
  const { addInventoryItem, user, isOnline } = useApp();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    lowStockAlert: '10',
  });

  const [errors, setErrors] = useState({
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Item name is required';
        return '';
      case 'costPrice':
      case 'sellingPrice':
      case 'quantity':
        const num = parseFloat(value);
        if (!value || isNaN(num) || num < 0) return 'Must be a positive number';
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
    const costError = validateField('costPrice', formData.costPrice);
    const sellingError = validateField('sellingPrice', formData.sellingPrice);
    const quantityError = validateField('quantity', formData.quantity);

    if (nameError || costError || sellingError || quantityError) {
      setErrors({
        name: nameError,
        costPrice: costError,
        sellingPrice: sellingError,
        quantity: quantityError,
      });
      return;
    }

    setLoading(true);
    try {
      await addInventoryItem({
        name: formData.name,
        category: formData.category || 'Other',
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        quantity: parseInt(formData.quantity),
        lowStockAlert: parseInt(formData.lowStockAlert) || 10,
      });

      toast.success(isOnline ? 'Item added & synced!' : 'Item saved (will sync when online)');
      navigate('/inventory');
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const currency = user?.currency || 'XAF';
  
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const profit = sellingPrice - costPrice;
  const profitMargin = costPrice > 0 ? (profit / costPrice) * 100 : 0;

  const categories = [
    'Food & Beverages',
    'Cosmetics',
    'Household',
    'Electronics',
    'Clothing',
    'Pharmacy',
    'Stationery',
    'Other'
  ];

  return (
    <div className="h-full flex flex-col space-y-6 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900">Add New Item</h1>
          <p className="text-sm text-gray-600">Add a product to your inventory</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-5 h-5" />
                Item Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item Name */}
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Maggie Cube, Blue Soap"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => handleBlur('name')}
                  className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cost & Selling Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="costPrice">Cost Price ({currency}) *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                    onBlur={() => handleBlur('costPrice')}
                    className={`mt-2 ${errors.costPrice ? 'border-red-500' : ''}`}
                  />
                  {errors.costPrice && (
                    <p className="text-xs text-red-600 mt-1">{errors.costPrice}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sellingPrice">Selling Price ({currency}) *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                    onBlur={() => handleBlur('sellingPrice')}
                    className={`mt-2 ${errors.sellingPrice ? 'border-red-500' : ''}`}
                  />
                  {errors.sellingPrice && (
                    <p className="text-xs text-red-600 mt-1">{errors.sellingPrice}</p>
                  )}
                </div>
              </div>

              {/* Quantity & Low Stock Alert */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Initial Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    onBlur={() => handleBlur('quantity')}
                    className={`mt-2 ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                  <Input
                    id="lowStockAlert"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="10"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData(prev => ({ ...prev, lowStockAlert: e.target.value }))}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when stock falls below this number
                  </p>
                </div>
              </div>

              {/* Photo Upload (Placeholder) */}
              <div>
                <Label className="text-gray-500 text-xs flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  Item Photo (Coming Soon)
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled 
                  className="w-full mt-2 opacity-50"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Summary */}
        <div className="space-y-6">
          {/* Profit Preview */}
          {costPrice > 0 && sellingPrice > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Profit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="text-gray-900">{sellingPrice.toLocaleString()} {currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Price:</span>
                      <span className="text-gray-900">-{costPrice.toLocaleString()} {currency}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-900">Profit per Unit:</span>
                      <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {profit >= 0 ? '+' : ''}{profit.toLocaleString()} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900">Margin:</span>
                      <span className={profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {profitMargin < 20 && profitMargin > 0 && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 p-2 rounded flex items-start gap-2">
                      <Info className="w-3 h-3 mt-0.5" />
                      <span>Low margin. Consider increasing selling price.</span>
                    </div>
                  )}

                  {profit < 0 && (
                    <div className="text-xs bg-red-100 text-red-800 p-2 rounded flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 mt-0.5" />
                      <span>Warning: Selling price is lower than cost!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Price Suggestion */}
          {costPrice > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Price Suggestion
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                <p className="mb-2">Recommended selling prices:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>20% Margin:</span>
                    <span className="text-blue-700">{(costPrice * 1.2).toFixed(0)} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30% Margin:</span>
                    <span className="text-blue-700">{(costPrice * 1.3).toFixed(0)} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50% Margin:</span>
                    <span className="text-blue-700">{(costPrice * 1.5).toFixed(0)} {currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Info */}
          {parseInt(formData.quantity) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stock Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Initial Stock:</span>
                  <span className="text-gray-900">{formData.quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alert Threshold:</span>
                  <span className="text-yellow-600">{formData.lowStockAlert || 10} units</span>
                </div>
                {costPrice > 0 && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900">Total Value:</span>
                    <span className="text-gray-900">
                      {(costPrice * parseInt(formData.quantity)).toLocaleString()} {currency}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inventory')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 gap-2 bg-blue-900 hover:bg-blue-800"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Adding Item...' : 'Add to Inventory'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}