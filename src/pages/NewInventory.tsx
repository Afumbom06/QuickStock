import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export function NewInventory() {
  const navigate = useNavigate();
  const { addInventoryItem, t, user } = useApp();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    lowStockAlert: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.quantity < 0 || formData.costPrice <= 0 || formData.sellingPrice <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addInventoryItem(formData);
      toast.success('Item added successfully!');
      navigate('/inventory');
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const currency = user?.currency || 'XAF';
  const profitMargin = formData.costPrice > 0 
    ? ((formData.sellingPrice - formData.costPrice) / formData.costPrice * 100).toFixed(1)
    : '0';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl text-gray-900">{t('addItem')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('itemName')} *</Label>
              <Input
                id="name"
                placeholder="e.g., Maggie, Bread, Soap"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="quantity">{t('stockLevel')} *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">{t('costPrice')} ({currency}) *</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.costPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="selling">{t('sellingPrice')} ({currency}) *</Label>
                <Input
                  id="selling"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="alert">{t('lowStockThreshold')}</Label>
              <Input
                id="alert"
                type="number"
                min="0"
                value={formData.lowStockAlert}
                onChange={(e) => setFormData(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-xs text-gray-500 mt-1">You'll be alerted when stock falls below this level</p>
            </div>

            {/* Profit Calculation */}
            {formData.costPrice > 0 && formData.sellingPrice > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit per unit:</span>
                    <span className="text-gray-900">{(formData.sellingPrice - formData.costPrice).toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit margin:</span>
                    <span className="text-green-600">{profitMargin}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/inventory')} className="flex-1">
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 gap-2">
                <Check className="w-4 h-4" />
                {t('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
