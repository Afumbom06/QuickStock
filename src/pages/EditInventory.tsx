import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export function EditInventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventory, updateInventoryItem, t, user } = useApp();
  const [loading, setLoading] = useState(false);

  const item = inventory.find(i => i.id === id);

  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    lowStockAlert: 10,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        quantity: item.quantity,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        lowStockAlert: item.lowStockAlert,
      });
    }
  }, [item]);

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500">Item not found</p>
        <Button onClick={() => navigate('/inventory')} className="mt-4">
          Back to Inventory
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await updateInventoryItem({
        ...item,
        ...formData,
      });
      toast.success('Item updated successfully!');
      navigate('/inventory');
    } catch (error) {
      toast.error('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const currency = user?.currency || 'XAF';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl text-gray-900">{t('editItem')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('itemName')} *</Label>
              <Input
                id="name"
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
            </div>

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
