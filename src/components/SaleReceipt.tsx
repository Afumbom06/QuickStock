import { useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Printer, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useApp } from '../contexts/AppContext';

export interface SaleReceiptData {
  id?: string;
  saleId?: string;
  date: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
  paymentType: 'cash' | 'momo' | 'credit';
  customerName?: string;
  customerNote?: string;
}

interface SaleReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleData: SaleReceiptData | null;
  showActions?: boolean;
}

export function SaleReceipt({ open, onOpenChange, saleData, showActions = true }: SaleReceiptProps) {
  const { user } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);
  const currency = user?.currency || 'XAF';

  const receiptId = saleData?.saleId || saleData?.id || `SALE-${Date.now()}`;

  const handlePrintReceipt = () => {
    if (!saleData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receiptId}</title>
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
            <span><strong>${receiptId}</strong></span>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <span>${format(new Date(saleData.date), 'MMM dd, yyyy')}</span>
          </div>
          <div class="info-row">
            <span>Time:</span>
            <span>${format(new Date(saleData.date), 'h:mm a')}</span>
          </div>
          ${saleData.customerName ? `
          <div class="info-row">
            <span>Customer:</span>
            <span><strong>${saleData.customerName}</strong></span>
          </div>
          ` : ''}

          <div class="item-section">
            <div class="item-name">${saleData.itemName}</div>
            <div class="item-details">
              ${saleData.quantity} × ${saleData.price.toLocaleString()} ${currency}
            </div>
            <div class="item-row">
              <span>Subtotal:</span>
              <span><strong>${saleData.total.toLocaleString()} ${currency}</strong></span>
            </div>
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>TOTAL:</span>
              <span>${saleData.total.toLocaleString()} ${currency}</span>
            </div>
          </div>

          <div class="payment-info">
            <div class="payment-method">
              ${saleData.paymentType === 'cash' ? '💵 CASH PAYMENT' : 
                saleData.paymentType === 'momo' ? '📱 MOBILE MONEY' : 
                '💳 CREDIT PAYMENT'}
            </div>
          </div>

          ${saleData.customerNote ? `
          <div class="customer-info">
            <div style="font-size: 12px; font-weight: bold; margin-bottom: 5px;">Note:</div>
            <div style="font-size: 12px;">${saleData.customerNote}</div>
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
    if (!saleData) return;

    const receiptText = `
═══════════════════════════════════
${user?.shopName || 'QuickStock'}
${user?.phone ? `Tel: ${user.phone}` : ''}
${user?.address || ''}
═══════════════════════════════════

        SALES RECEIPT

Receipt No: ${receiptId}
Date: ${format(new Date(saleData.date), 'MMM dd, yyyy h:mm a')}
${saleData.customerName ? `Customer: ${saleData.customerName}` : ''}

───────────────────────────────────
ITEM DETAILS
───────────────────────────────────

${saleData.itemName}
${saleData.quantity} × ${saleData.price.toLocaleString()} ${currency}
Subtotal: ${saleData.total.toLocaleString()} ${currency}

═══════════════════════════════════
TOTAL: ${saleData.total.toLocaleString()} ${currency}
═══════════════════════════════════

Payment Method: ${saleData.paymentType.toUpperCase()}

${saleData.customerNote ? `Note: ${saleData.customerNote}\n` : ''}
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
    a.download = `receipt-${receiptId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Receipt downloaded!');
  };

  if (!saleData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Sale Receipt
          </DialogTitle>
          <DialogDescription>
            View, print, or download this sale receipt.
          </DialogDescription>
        </DialogHeader>

        {/* Receipt Preview */}
        <div ref={receiptRef} className="bg-white border-2 border-gray-300 rounded-lg p-6 my-4">
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h2 className="text-xl text-gray-900 mb-1">{user?.shopName || 'QuickStock'}</h2>
            {user?.phone && <p className="text-xs text-gray-600">Tel: {user.phone}</p>}
            {user?.address && <p className="text-xs text-gray-600">{user.address}</p>}
            <p className="text-sm text-gray-900 mt-3">SALES RECEIPT</p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Receipt No:</span>
              <span className="text-gray-900">{receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-900">
                {format(new Date(saleData.date), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="text-gray-900">
                {format(new Date(saleData.date), 'h:mm a')}
              </span>
            </div>
            {saleData.customerName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="text-gray-900">{saleData.customerName}</span>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-4 mb-4">
            <div className="text-gray-900 mb-2">{saleData.itemName}</div>
            <div className="text-xs text-gray-600 mb-2">
              {saleData.quantity} × {saleData.price.toLocaleString()} {currency}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{saleData.total.toLocaleString()} {currency}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg mb-4">
            <span className="text-gray-900">TOTAL:</span>
            <span className="text-gray-900">{saleData.total.toLocaleString()} {currency}</span>
          </div>

          {/* Payment Method */}
          <div className="text-center py-3 bg-gray-100 rounded-lg mb-4">
            <p className="text-sm text-gray-900">
              {saleData.paymentType === 'cash' && '💵 CASH PAYMENT'}
              {saleData.paymentType === 'momo' && '📱 MOBILE MONEY'}
              {saleData.paymentType === 'credit' && '💳 CREDIT PAYMENT'}
            </p>
          </div>

          {/* Note */}
          {saleData.customerNote && (
            <div className="border-t border-dashed border-gray-300 pt-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Note:</p>
              <p className="text-xs text-gray-900">{saleData.customerNote}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center border-t-2 border-dashed border-gray-300 pt-4">
            <p className="text-sm text-gray-900 mb-1">Thank You!</p>
            <p className="text-xs text-gray-600 mb-2">Please come again</p>
            <p className="text-xs text-gray-500">Powered by QuickStock</p>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handlePrintReceipt}
              variant="outline"
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
