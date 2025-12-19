import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Check, 
  Search, 
  Plus, 
  Minus, 
  RotateCcw,
  Wallet,
  Smartphone,
  CreditCard,
  Package,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog';

export function EditSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sales, updateSale, inventory, user, isOnline } = useApp();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customItemDialog, setCustomItemDialog] = useState(false);

  const sale = sales.find(s => s.id === id);

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 1,
    price: 0,
    paymentType: 'cash' as 'cash' | 'momo' | 'credit',
    customerNote: '',
    customerName: '',
  });

  const [customItem, setCustomItem] = useState({
    name: '',
    price: 0,
  });

  // Initialize form with sale data
  useEffect(() => {
    if (sale) {
      setFormData({
        itemName: sale.itemName,
        quantity: sale.quantity,
        price: sale.price,
        paymentType: sale.paymentType,
        customerNote: sale.customerNote || '',
        customerName: sale.customerName || '',
      });
    }
  }, [sale]);

  if (!sale) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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

  if (sale.synced) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg text-gray-900 mb-2">Cannot Edit Synced Sale</h3>
            <p className="text-gray-500 mb-4">This sale has already been synced and cannot be edited. Create a correction entry instead.</p>
            <Button onClick={() => navigate(`/sales/${id}`)}>
              Back to Sale Details
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!formData.itemName || formData.quantity <= 0 || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check stock for existing items
    const inventoryItem = inventory.find(i => i.name === formData.itemName);
    if (inventoryItem && inventoryItem.quantity < formData.quantity) {
      toast.error(`Not enough stock! Only ${inventoryItem.quantity} available.`);
      return;
    }

    setLoading(true);
    try {
      await updateSale({
        ...sale,
        itemName: formData.itemName,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.quantity * formData.price,
        paymentType: formData.paymentType,
        customerNote: formData.customerNote,
        customerName: formData.customerName,
      });

      toast.success(isOnline ? 'Sale updated & synced!' : 'Sale updated (will sync when online)');
      navigate(`/sales/${id}`);
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Failed to update sale');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item: typeof inventory[0]) => {
    setFormData(prev => ({
      ...prev,
      itemName: item.name,
      price: item.sellingPrice,
    }));
  };

  const handleCustomItemAdd = () => {
    if (!customItem.name || customItem.price <= 0) {
      toast.error('Please provide item name and price');
      return;
    }
    setFormData(prev => ({
      ...prev,
      itemName: customItem.name,
      price: customItem.price,
    }));
    setCustomItemDialog(false);
    toast.success(`Custom item "${customItem.name}" added`);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = inventory.find(i => i.name === formData.itemName);
  const total = formData.quantity * formData.price;
  const currency = user?.currency || 'XAF';

  const paymentTypes = [
    { value: 'cash', label: 'Cash', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
    { value: 'momo', label: 'Mobile Money', icon: Smartphone, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'credit', label: 'Credit', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="h-full flex flex-col space-y-4 pb-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/sales/${id}`)} 
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl text-gray-900">Edit Sale</h1>
            <p className="text-sm text-gray-600">Modify sale details</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-2">
          <Package className="w-4 h-4" />
          Editing
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-4 flex-1">
        {/* Left: Item Selection */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 flex flex-col space-y-4"
        >
          {/* Search & Select Item */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Select Item</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={customItemDialog} onOpenChange={setCustomItemDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Custom Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Custom Item</DialogTitle>
                      <DialogDescription>
                        Add an item that's not in your inventory
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Item Name</Label>
                        <Input
                          value={customItem.name}
                          onChange={(e) => setCustomItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Special Order Item"
                        />
                      </div>
                      <div>
                        <Label>Price ({currency})</Label>
                        <Input
                          type="number"
                          value={customItem.price}
                          onChange={(e) => setCustomItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>
                      <Button onClick={handleCustomItemAdd} className="w-full">
                        Add Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Inventory Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filteredInventory.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No items found. Add a custom item or adjust your search.
                  </div>
                ) : (
                  filteredInventory.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => handleItemSelect(item)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          formData.itemName === item.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm text-gray-900">{item.name}</h4>
                          {formData.itemName === item.name && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Stock: {item.quantity}</span>
                          <span className="text-blue-600">{item.sellingPrice} {currency}</span>
                        </div>
                        {item.quantity <= item.lowStockAlert && (
                          <Badge variant="destructive" className="mt-2 text-xs">
                            Low Stock
                          </Badge>
                        )}
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sale Details */}
          <Card className="flex-1">
            <CardHeader className="border-b">
              <CardTitle>Sale Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Quantity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      className="text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedItem && formData.quantity > selectedItem.quantity && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Exceeds available stock ({selectedItem.quantity})
                    </p>
                  )}
                </div>

                <div>
                  <Label>Unit Price ({currency})</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Payment Type */}
              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {paymentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.paymentType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, paymentType: type.value as any }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `border-current ${type.bg} ${type.color}`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? type.color : 'text-gray-400'}`} />
                        <div className={`text-xs text-center ${isSelected ? type.color : 'text-gray-600'}`}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <Label>Customer Name (Optional)</Label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="John Doe"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={formData.customerNote}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerNote: e.target.value }))}
                    placeholder="Add any additional notes..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col space-y-4"
        >
          {/* Summary Card */}
          <Card className="sticky top-4">
            <CardHeader className="border-b">
              <CardTitle className="text-base">Sale Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {formData.itemName ? (
                <>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Item</div>
                      <div className="text-sm text-gray-900">{formData.itemName}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Quantity</div>
                        <div className="text-lg text-gray-900">{formData.quantity}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Unit Price</div>
                        <div className="text-lg text-gray-900">{formData.price}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                      <div className="text-xs text-blue-600 mb-1">Total Amount</div>
                      <div className="text-3xl text-blue-600">{total.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 mt-1">{currency}</div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.itemName}
                    className="w-full gap-2"
                  >
                    {loading ? (
                      <RotateCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Update Sale
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate(`/sales/${id}`)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Select an item to see summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
