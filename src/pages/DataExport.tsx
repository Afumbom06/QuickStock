import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download,
  FileText,
  FileSpreadsheet,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  Receipt,
  Loader2,
  CheckCircle2,
  Info,
  FileArchive,
  Database,
  BarChart3,
  Calendar,
  Shield,
  Zap,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  formats: ('csv' | 'pdf')[];
  dataCount: number;
  category: string;
}

export function DataExport() {
  const { sales, expenses, inventory, customers, debts, user } = useApp();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState<string | null>(null);

  const exportOptions: ExportOption[] = [
    {
      id: 'sales',
      name: 'Sales History',
      description: `Export all sales transactions and records`,
      icon: ShoppingCart,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      formats: ['csv', 'pdf'],
      dataCount: sales.length,
      category: 'Transactions',
    },
    {
      id: 'expenses',
      name: 'Expenses',
      description: `Export all expense records and categories`,
      icon: DollarSign,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      formats: ['csv', 'pdf'],
      dataCount: expenses.length,
      category: 'Transactions',
    },
    {
      id: 'inventory',
      name: 'Inventory List',
      description: `Export complete product catalog with prices`,
      icon: Package,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      formats: ['csv', 'pdf'],
      dataCount: inventory.length,
      category: 'Products',
    },
    {
      id: 'customers',
      name: 'Customer Debts',
      description: `Export customer accounts and balances`,
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      formats: ['csv', 'pdf'],
      dataCount: customers.length,
      category: 'Customers',
    },
    {
      id: 'summary',
      name: 'Business Summary',
      description: `Complete business overview and analytics report`,
      icon: Receipt,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      formats: ['pdf'],
      dataCount: sales.length + expenses.length,
      category: 'Reports',
    },
  ];

  const generateCSV = (data: any[], headers: string[], filename: string) => {
    // Create CSV content
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header.toLowerCase().replace(' ', '')];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value || '').replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(','));
    });
    
    // Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePDF = (title: string, data: any[], filename: string) => {
    // For a real app, you'd use a library like jsPDF or pdfmake
    // This is a simplified version that creates an HTML page
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
          .header { margin-bottom: 30px; }
          .meta { color: #666; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f3f4f6; padding: 12px; text-align: left; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${user?.shopName || 'My Shop'}</h1>
          <div class="meta">
            <strong>${title}</strong><br/>
            Generated: ${format(new Date(), 'MMMM dd, yyyy • h:mm a')}<br/>
            Total Records: ${data.length}
          </div>
        </div>
        ${data.length > 0 ? `
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p>No data available</p>'}
        <div class="footer">
          Mini-ERP PWA • ${user?.phone || ''}
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleExport = async (optionId: string, format: 'csv' | 'pdf') => {
    setExporting(`${optionId}-${format}`);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing

      const currency = user?.currency || 'XAF';
      const timestamp = format(new Date(), 'yyyy-MM-dd');

      switch (optionId) {
        case 'sales':
          if (format === 'csv') {
            const salesData = sales.map(s => ({
              Date: format(new Date(s.date), 'yyyy-MM-dd'),
              Item: s.itemName,
              Quantity: s.quantity,
              Price: s.price,
              Total: s.total,
              Payment: s.paymentType,
              Customer: s.customerName || 'N/A',
            }));
            generateCSV(salesData, ['Date', 'Item', 'Quantity', 'Price', 'Total', 'Payment', 'Customer'], `sales-${timestamp}.csv`);
          } else {
            const salesData = sales.map(s => ({
              Date: format(new Date(s.date), 'MMM dd, yyyy'),
              Item: s.itemName,
              Qty: s.quantity,
              Total: `${s.total} ${currency}`,
            }));
            generatePDF('Sales Report', salesData, `sales-${timestamp}.pdf`);
          }
          break;

        case 'expenses':
          if (format === 'csv') {
            const expensesData = expenses.map(e => ({
              Date: format(new Date(e.date), 'yyyy-MM-dd'),
              Category: e.category,
              Amount: e.amount,
              Description: e.description,
            }));
            generateCSV(expensesData, ['Date', 'Category', 'Amount', 'Description'], `expenses-${timestamp}.csv`);
          } else {
            const expensesData = expenses.map(e => ({
              Date: format(new Date(e.date), 'MMM dd, yyyy'),
              Category: e.category,
              Amount: `${e.amount} ${currency}`,
              Description: e.description,
            }));
            generatePDF('Expenses Report', expensesData, `expenses-${timestamp}.pdf`);
          }
          break;

        case 'inventory':
          if (format === 'csv') {
            const inventoryData = inventory.map(i => ({
              Name: i.name,
              Quantity: i.quantity,
              'Cost Price': i.costPrice,
              'Selling Price': i.sellingPrice,
              'Low Stock Alert': i.lowStockAlert,
            }));
            generateCSV(inventoryData, ['Name', 'Quantity', 'Cost Price', 'Selling Price', 'Low Stock Alert'], `inventory-${timestamp}.csv`);
          } else {
            const inventoryData = inventory.map(i => ({
              Item: i.name,
              'In Stock': i.quantity,
              'Cost': `${i.costPrice} ${currency}`,
              'Price': `${i.sellingPrice} ${currency}`,
            }));
            generatePDF('Inventory List', inventoryData, `inventory-${timestamp}.pdf`);
          }
          break;

        case 'customers':
          const customersWithDebts = customers.map(c => {
            const customerDebts = debts.filter(d => d.customerId === c.id);
            const totalDebt = customerDebts
              .filter(d => d.type === 'credit')
              .reduce((sum, d) => sum + d.amount, 0);
            const totalPaid = customerDebts
              .filter(d => d.type === 'payment')
              .reduce((sum, d) => sum + d.amount, 0);
            const balance = totalDebt - totalPaid;

            return {
              Name: c.name,
              Phone: c.phone || 'N/A',
              Balance: balance,
              Transactions: customerDebts.length,
            };
          });

          if (format === 'csv') {
            generateCSV(customersWithDebts, ['Name', 'Phone', 'Balance', 'Transactions'], `customers-${timestamp}.csv`);
          } else {
            const pdfData = customersWithDebts.map(c => ({
              Customer: c.Name,
              Phone: c.Phone,
              'Amount Owed': `${c.Balance} ${currency}`,
              Status: c.Balance > 0 ? 'Owing' : 'Cleared',
            }));
            generatePDF('Customer Debts Report', pdfData, `customers-${timestamp}.pdf`);
          }
          break;

        case 'summary':
          const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
          const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
          const profit = totalSales - totalExpenses;

          const summaryData = [
            { Metric: 'Total Sales', Value: `${totalSales.toLocaleString()} ${currency}`, Count: sales.length },
            { Metric: 'Total Expenses', Value: `${totalExpenses.toLocaleString()} ${currency}`, Count: expenses.length },
            { Metric: 'Net Profit', Value: `${profit.toLocaleString()} ${currency}`, Count: '-' },
            { Metric: 'Inventory Items', Value: inventory.length, Count: '-' },
            { Metric: 'Customers', Value: customers.length, Count: '-' },
          ];

          generatePDF('Business Summary Report', summaryData, `summary-${timestamp}.pdf`);
          break;
      }

      toast.success('Export successful!', {
        description: `Downloaded ${format.toUpperCase()} file`,
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again',
      });
    } finally {
      setExporting(null);
    }
  };

  const totalRecords = sales.length + expenses.length + inventory.length + customers.length;

  // Group options by category
  const categories = ['Transactions', 'Products', 'Customers', 'Reports'];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-b"
      >
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="gap-2 mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Data Export</h1>
                <p className="text-sm text-gray-600">Download your business data in various formats</p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <HardDrive className="w-3 h-3" />
              {totalRecords} records
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6 pb-24">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Export Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      Available Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-4 gap-3">
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl text-gray-900">{sales.length}</p>
                        <p className="text-xs text-gray-600">Sales</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-xl">
                        <DollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl text-gray-900">{expenses.length}</p>
                        <p className="text-xs text-gray-600">Expenses</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl text-gray-900">{inventory.length}</p>
                        <p className="text-xs text-gray-600">Products</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl text-gray-900">{customers.length}</p>
                        <p className="text-xs text-gray-600">Customers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Export Options by Category */}
              {categories.map((category, catIndex) => {
                const categoryOptions = exportOptions.filter(opt => opt.category === category);
                if (categoryOptions.length === 0) return null;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + catIndex * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{category}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categoryOptions.map((option, optIndex) => {
                          const Icon = option.icon;
                          return (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + catIndex * 0.1 + optIndex * 0.05 }}
                              className="p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-gray-50 transition-all"
                            >
                              <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-14 h-14 ${option.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-7 h-7 ${option.iconColor}`} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-gray-900">{option.name}</h3>
                                    <Badge variant="outline" className="text-xs">
                                      {option.dataCount} items
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>

                                  {/* Export Buttons */}
                                  <div className="flex flex-wrap gap-2">
                                    {option.formats.includes('csv') && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport(option.id, 'csv')}
                                        disabled={exporting !== null || option.dataCount === 0}
                                        className="gap-2"
                                      >
                                        {exporting === `${option.id}-csv` ? (
                                          <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Exporting...
                                          </>
                                        ) : (
                                          <>
                                            <FileSpreadsheet className="w-4 h-4" />
                                            Export CSV
                                          </>
                                        )}
                                      </Button>
                                    )}

                                    {option.formats.includes('pdf') && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport(option.id, 'pdf')}
                                        disabled={exporting !== null || option.dataCount === 0}
                                        className="gap-2"
                                      >
                                        {exporting === `${option.id}-pdf` ? (
                                          <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Exporting...
                                          </>
                                        ) : (
                                          <>
                                            <FileText className="w-4 h-4" />
                                            Export PDF
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>

                                  {option.dataCount === 0 && (
                                    <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                      <Info className="w-3 h-3" />
                                      No data available to export
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Format Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky top-6 space-y-6"
              >
                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileArchive className="w-5 h-5 text-indigo-600" />
                      Export Formats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* CSV */}
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        <h4 className="text-gray-900">CSV Format</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Best for data analysis and spreadsheets
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Opens in Excel
                        </p>
                        <p className="text-xs text-gray-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Google Sheets compatible
                        </p>
                        <p className="text-xs text-gray-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Easy to edit
                        </p>
                      </div>
                    </div>

                    {/* PDF */}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h4 className="text-gray-900">PDF Format</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Best for printing and sharing
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Print-ready
                        </p>
                        <p className="text-xs text-gray-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Professional format
                        </p>
                        <p className="text-xs text-gray-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Universal compatibility
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Tips */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-blue-900">
                          <strong>Export Tips:</strong>
                        </p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li className="flex items-start gap-1">
                            <span>•</span>
                            <span>Exports include all current data</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span>•</span>
                            <span>Works offline (local data)</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span>•</span>
                            <span>No data leaves your device</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span>•</span>
                            <span>Files saved to Downloads folder</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-purple-900">
                          <strong>Privacy Protected:</strong>
                        </p>
                        <p className="text-xs text-purple-800">
                          All exports are generated locally on your device. Your business data stays private and secure.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
