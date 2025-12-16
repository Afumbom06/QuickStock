import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  Check, 
  Trash2,
  Plus,
  Minus,
  TrendingUp,
  AlertCircle,
  Info,
  Package
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

export function EditInventoryItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventory, updateInventoryItem, deleteInventoryItem, user, isOnline } = useApp();
  const [loading, setLoading] = useState(false);

  const item = inventory.find(i => i.id === id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    lowStockAlert: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category || '',
        costPrice: item.costPrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
        quantity: item.quantity.toString(),
        lowStockAlert: item.lowStockAlert.toString(),
      });
    }
  }, [item]);

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg text-gray-900 mb-2">Item not found</h3>
            <p className="text-gray-500 mb-4">This item may have been deleted.</p>
            <Button onClick={() => navigate('/inventory')}>
              Back to Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await updateInventoryItem({
        ...item,
        name: formData.name,
        category: formData.category || 'Other',
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        quantity: parseInt(formData.quantity),
        lowStockAlert: parseInt(formData.lowStockAlert),
      });

      toast.success(isOnline ? 'Item updated & synced!' : 'Changes saved (will sync when online)');
      navigate('/inventory');
    } catch (error) {
      toast.error('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInventoryItem(id!);
      toast.success('Item deleted');
      navigate('/inventory');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const adjustQuantity = (delta: number) => {
    const newQty = Math.max(0, parseInt(formData.quantity) + delta);
    setFormData(prev => ({ ...prev, quantity: newQty.toString() }));
  };

  const currency = user?.currency || 'XAF';
  
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const profit = sellingPrice - costPrice;
  const profitMargin = costPrice > 0 ? (profit / costPrice) * 100 : 0;
  const quantity = parseInt(formData.quantity) || 0;
  const lowStockAlert = parseInt(formData.lowStockAlert) || 10;

  const stockStatus = 
    quantity <= lowStockAlert / 2 ? { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' } :
    quantity <= lowStockAlert ? { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low' } :
    { color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' };

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
        <div className="flex-1">
          <h1 className="text-2xl text-gray-900">Edit Item</h1>
          <p className="text-sm text-gray-600">{item.name}</p>
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
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
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
                    value={formData.costPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="sellingPrice">Selling Price ({currency}) *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Low Stock Alert */}
              <div>
                <Label htmlFor="lowStockAlert">Low Stock Alert Threshold</Label>
                <Input
                  id="lowStockAlert"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.lowStockAlert}
                  onChange={(e) => setFormData(prev => ({ ...prev, lowStockAlert: e.target.value }))}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this number
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stock Adjustment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stock Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Stock</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => adjustQuantity(-10)}
                    className="h-12 px-4"
                  >
                    <Minus className="w-5 h-5 mr-1" />
                    10
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => adjustQuantity(-1)}
                    className="h-12 px-4"
                  >
                    <Minus className="w-5 h-5 mr-1" />
                    1
                  </Button>
                  
                  <Input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="text-center text-xl h-12 flex-1"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => adjustQuantity(1)}
                    className="h-12 px-4"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => adjustQuantity(10)}
                    className="h-12 px-4"
                  >
                    <Plus className="w-5 h-5 mr-1" />
                    10
                  </Button>
                </div>
              </div>

              {/* Stock Status Display */}
              <div className={`p-4 rounded-lg ${stockStatus.bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Stock Status</p>
                    <p className={`text-2xl ${stockStatus.color}`}>
                      {quantity} units
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${stockStatus.bg} ${stockStatus.color} border-2 border-current`}>
                    {stockStatus.label}
                  </div>
                </div>
                
                {/* Stock Bar */}
                <div className="w-full bg-white rounded-full h-3 mt-3">
                  <div 
                    className={`h-3 rounded-full ${
                      quantity <= lowStockAlert / 2 ? 'bg-red-500' :
                      quantity <= lowStockAlert ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((quantity / (lowStockAlert * 2)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Summary */}
        <div className="space-y-6">
          {/* Profit Analysis */}
          {costPrice > 0 && sellingPrice > 0 && (
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
                  {quantity > 0 && (
                    <div className="border-t pt-2 flex justify-between">
                      <span className="text-gray-900">Total Profit:</span>
                      <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {profit >= 0 ? '+' : ''}{(profit * quantity).toLocaleString()} {currency}
                      </span>
                    </div>
                  )}
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
          )}

          {/* Stock Value */}
          {quantity > 0 && costPrice > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stock Value</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Stock:</span>
                  <span className="text-gray-900">{quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Value:</span>
                  <span className="text-gray-900">
                    {(costPrice * quantity).toLocaleString()} {currency}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900">Selling Value:</span>
                  <span className="text-gray-900">
                    {(sellingPrice * quantity).toLocaleString()} {currency}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Alert Info */}
          {quantity <= lowStockAlert && (
            <Card className={quantity <= lowStockAlert / 2 ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className={quantity <= lowStockAlert / 2 ? 'w-5 h-5 text-red-600' : 'w-5 h-5 text-yellow-600'} />
                  <div className="flex-1">
                    <p className={`text-sm mb-1 ${quantity <= lowStockAlert / 2 ? 'text-red-900' : 'text-yellow-900'}`}>
                      {quantity <= lowStockAlert / 2 ? 'Critical Stock Level!' : 'Low Stock Alert'}
                    </p>
                    <p className={`text-xs ${quantity <= lowStockAlert / 2 ? 'text-red-700' : 'text-yellow-700'}`}>
                      {quantity <= lowStockAlert / 2 
                        ? 'Stock critically low. Restock immediately to avoid running out.'
                        : 'Stock is getting low. Consider restocking soon.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove "{item.name}" from your inventory.
                    This action cannot be undone.
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

            <div className="flex flex-1 gap-3">
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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}