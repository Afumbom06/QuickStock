import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
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
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog';
import { SaleReceipt, SaleReceiptData } from '../components/SaleReceipt';

export function NewSale() {
  const navigate = useNavigate();
  const { addSale, inventory, t, user, isOnline } = useApp();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customItemDialog, setCustomItemDialog] = useState(false);
  const [receiptDialog, setReceiptDialog] = useState(false);
  const [receiptData, setReceiptData] = useState<SaleReceiptData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

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
      const saleId = `SALE-${Date.now()}`;
      const saleDate = new Date().toISOString();
      
      await addSale({
        itemName: formData.itemName,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.quantity * formData.price,
        paymentType: formData.paymentType,
        customerNote: formData.customerNote,
        customerName: formData.customerName,
        date: saleDate,
      });

      // Prepare receipt data
      const receipt: SaleReceiptData = {
        saleId,
        date: saleDate,
        itemName: formData.itemName,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.quantity * formData.price,
        paymentType: formData.paymentType,
        customerName: formData.customerName,
        customerNote: formData.customerNote,
      };

      setReceiptData(receipt);
      setReceiptDialog(true);

      toast.success(isOnline ? 'Sale added & synced!' : 'Sale saved (will sync when online)');
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Failed to add sale');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receiptData?.saleId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Courier New', monospace;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
          }
          .receipt {
            border: 2px solid #000;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 15px;
            margin-bottom: 15px;
          }
          .shop-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .shop-info {
            font-size: 12px;
            margin-bottom: 3px;
          }
          .receipt-title {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .item-section {
            border-top: 2px dashed #000;
            border-bottom: 2px dashed #000;
            padding: 15px 0;
            margin: 15px 0;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .item-name {
            font-weight: bold;
            font-size: 14px;
          }
          .item-details {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .total-section {
            margin-top: 15px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
          }
          .payment-info {
            text-align: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px dashed #000;
          }
          .payment-method {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .customer-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px dashed #000;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            padding-top: 15px;
            border-top: 2px dashed #000;
          }
          .thank-you {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          @media print {
            body {
              padding: 0;
            }
            .receipt {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="shop-name">${user?.shopName || 'QuickStock'}</div>
            ${user?.phone ? `<div class="shop-info">Tel: ${user.phone}</div>` : ''}
            ${user?.address ? `<div class="shop-info">${user.address}</div>` : ''}
            <div class="receipt-title">SALES RECEIPT</div>
          </div>

          <div class="info-row">
            <span>Receipt No:</span>
            <span><strong>${receiptData?.saleId}</strong></span>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <span>${receiptData ? format(new Date(receiptData.date), 'MMM dd, yyyy') : ''}</span>
          </div>
          <div class="info-row">
            <span>Time:</span>
            <span>${receiptData ? format(new Date(receiptData.date), 'h:mm a') : ''}</span>
          </div>
          ${receiptData?.customerName ? `
          <div class="info-row">
            <span>Customer:</span>
            <span><strong>${receiptData.customerName}</strong></span>
          </div>
          ` : ''}

          <div class="item-section">
            <div class="item-name">${receiptData?.itemName}</div>
            <div class="item-details">
              ${receiptData?.quantity} × ${receiptData?.price.toLocaleString()} ${user?.currency || 'XAF'}
            </div>
            <div class="item-row">
              <span>Subtotal:</span>
              <span><strong>${receiptData?.total.toLocaleString()} ${user?.currency || 'XAF'}</strong></span>
            </div>
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>TOTAL:</span>
              <span>${receiptData?.total.toLocaleString()} ${user?.currency || 'XAF'}</span>
            </div>
          </div>

          <div class="payment-info">
            <div class="payment-method">
              ${receiptData?.paymentType === 'cash' ? '💵 CASH PAYMENT' : 
                receiptData?.paymentType === 'momo' ? '📱 MOBILE MONEY' : 
                '💳 CREDIT PAYMENT'}
            </div>
          </div>

          ${receiptData?.customerNote ? `
          <div class="customer-info">
            <div style="font-size: 12px; font-weight: bold; margin-bottom: 5px;">Note:</div>
            <div style="font-size: 12px;">${receiptData.customerNote}</div>
          </div>
          ` : ''}

          <div class="footer">
            <div class="thank-you">Thank You!</div>
            <div>Please come again</div>
            <div style="margin-top: 10px;">Powered by QuickStock</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleDownloadReceipt = () => {
    // Create a simple text receipt for download
    const receiptText = `
═══════════════════════════════════
${user?.shopName || 'QuickStock'}
${user?.phone ? `Tel: ${user.phone}` : ''}
${user?.address || ''}
═══════════════════════════════════

        SALES RECEIPT

Receipt No: ${receiptData?.saleId}
Date: ${receiptData ? format(new Date(receiptData.date), 'MMM dd, yyyy h:mm a') : ''}
${receiptData?.customerName ? `Customer: ${receiptData.customerName}` : ''}

───────────────────────────────────
ITEM DETAILS
───────────────────────────────────

${receiptData?.itemName}
${receiptData?.quantity} × ${receiptData?.price.toLocaleString()} ${user?.currency || 'XAF'}
Subtotal: ${receiptData?.total.toLocaleString()} ${user?.currency || 'XAF'}

═══════════════════════════════════
TOTAL: ${receiptData?.total.toLocaleString()} ${user?.currency || 'XAF'}
═══════════════════════════════════

Payment Method: ${receiptData?.paymentType.toUpperCase()}

${receiptData?.customerNote ? `Note: ${receiptData.customerNote}\n` : ''}
───────────────────────────────────
Thank You!
Please come again
Powered by QuickStock
═══════════════════════════════════
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData?.saleId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Receipt downloaded!');
  };

  const handleCloseReceipt = () => {
    setReceiptDialog(false);
    setReceiptData(null);
    handleReset();
    // Don't navigate away, allow user to make another sale
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
    setCustomItem({ name: '', price: 0 });
    toast.success('Custom item added!');
  };

  const handleReset = () => {
    setFormData({
      itemName: '',
      quantity: 1,
      price: 0,
      paymentType: 'cash',
      customerNote: '',
      customerName: '',
    });
    setSearchTerm('');
  };

  const incrementQuantity = () => {
    setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decrementQuantity = () => {
    if (formData.quantity > 1) {
      setFormData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = formData.quantity * formData.price;
  const currency = user?.currency || 'XAF';
  
  const selectedInventoryItem = inventory.find(i => i.name === formData.itemName);
  const stockWarning = selectedInventoryItem && selectedInventoryItem.quantity < formData.quantity;
  const lowStockWarning = selectedInventoryItem && selectedInventoryItem.quantity <= selectedInventoryItem.lowStockAlert && selectedInventoryItem.quantity >= formData.quantity;

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: Wallet, color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'momo', label: 'MoMo', icon: Smartphone, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'credit', label: 'Credit', icon: CreditCard, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  ];

  return (
    <div className="h-full flex flex-col space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/sales')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900">{t('newSale')}</h1>
          <p className="text-sm text-gray-600">Add a new sale transaction</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {/* Item Selection - Left Side */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
          {/* Search & Custom Item */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Select Item</CardTitle>
                <Dialog open={customItemDialog} onOpenChange={setCustomItemDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Custom Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Custom Item</DialogTitle>
                      <DialogDescription>Add a custom item to the sale.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Item Name *</Label>
                        <Input
                          placeholder="e.g., Special Order"
                          value={customItem.name}
                          onChange={(e) => setCustomItem(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Price ({currency}) *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          value={customItem.price || ''}
                          onChange={(e) => setCustomItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <Button onClick={handleCustomItemAdd} className="w-full">
                        Add Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar */}
              <div className="relative mb-4 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1">
                {filteredInventory.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleItemSelect(item)}
                    className={`p-3 rounded-lg border-2 text-left transition-all h-fit ${
                      formData.itemName === item.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {item.quantity <= item.lowStockAlert && (
                        <Badge variant="destructive" className="text-xs">Low</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-900 mb-1 line-clamp-2">{item.name}</div>
                    <div className="text-xs text-gray-500 mb-1">Stock: {item.quantity}</div>
                    <div className="text-sm text-blue-600">{item.sellingPrice} {currency}</div>
                  </motion.button>
                ))}
                {filteredInventory.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No items found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Item Display */}
          {formData.itemName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0"
            >
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Selected Item</div>
                      <div className="text-lg text-gray-900">{formData.itemName}</div>
                      <div className="text-sm text-blue-600">{formData.price} {currency} each</div>
                    </div>
                    {selectedInventoryItem && (
                      <div className="text-right">
                        <div className="text-xs text-gray-600">Available Stock</div>
                        <div className={`text-xl ${selectedInventoryItem.quantity <= selectedInventoryItem.lowStockAlert ? 'text-red-600' : 'text-gray-900'}`}>
                          {selectedInventoryItem.quantity}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Stock Warnings */}
                  {stockWarning && (
                    <div className="mt-3 p-2 bg-red-100 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Not enough stock! Only {selectedInventoryItem?.quantity} available</span>
                    </div>
                  )}
                  {lowStockWarning && !stockWarning && (
                    <div className="mt-3 p-2 bg-yellow-100 rounded-lg flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Low stock warning: Only {selectedInventoryItem?.quantity} left</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sale Details - Right Side */}
        <div className="flex flex-col overflow-y-auto">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Sale Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quantity Controls */}
              <div>
                <Label>Quantity *</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={formData.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="text-center text-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, quantity: 1 }))}>
                    1
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, quantity: 5 }))}>
                    5
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, quantity: 10 }))}>
                    10
                  </Button>
                </div>
              </div>

              {/* Price (editable for custom items) */}
              <div>
                <Label>Price ({currency}) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-2"
                />
              </div>

              {/* Total Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl text-blue-600">{total.toLocaleString()} {currency}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formData.quantity} × {formData.price} {currency}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <Label className="mb-3 block">Payment Method *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentType === method.value;
                    return (
                      <motion.button
                        key={method.value}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData(prev => ({ ...prev, paymentType: method.value as any }))}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? method.color + ' border-current shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{method.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <Label>Customer Name</Label>
                <Input
                  placeholder="Optional"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Customer Note */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add any notes..."
                  value={formData.customerNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerNote: e.target.value }))}
                  rows={2}
                  className="mt-2"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.itemName || formData.quantity <= 0 || formData.price <= 0 || stockWarning}
                  className="w-full gap-2 h-12"
                >
                  <Check className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Complete Sale'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Preview Dialog */}
      <SaleReceipt
        open={receiptDialog}
        onOpenChange={(open) => {
          setReceiptDialog(open);
          if (!open) {
            handleCloseReceipt();
          }
        }}
        saleData={receiptData}
      />
    </div>
  );
}