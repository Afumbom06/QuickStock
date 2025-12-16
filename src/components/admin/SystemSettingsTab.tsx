import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Settings,
  Save,
  Building2,
  DollarSign,
  Receipt,
  Palette,
  Shield,
  Bell,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { SystemSettings } from '../../utils/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';

export function SystemSettingsTab() {
  const [settings, setSettings] = useState<SystemSettings>({
    id: '1',
    allowMultipleBranches: true,
    requireApprovalForExpenses: false,
    expenseApprovalLimit: 50000,
    lowStockAlertEnabled: true,
    defaultCurrency: 'XAF',
    taxEnabled: false,
    taxRate: 0,
    receiptFooterText: 'Thank you for your business!',
    primaryColor: '#3b82f6',
    updatedAt: new Date().toISOString(),
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real implementation, save to IndexedDB
    setSettings({ ...settings, updatedAt: new Date().toISOString() });
    toast.success('Settings saved successfully!');
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      id: '1',
      allowMultipleBranches: true,
      requireApprovalForExpenses: false,
      expenseApprovalLimit: 50000,
      lowStockAlertEnabled: true,
      defaultCurrency: 'XAF',
      taxEnabled: false,
      taxRate: 0,
      receiptFooterText: 'Thank you for your business!',
      primaryColor: '#3b82f6',
      updatedAt: new Date().toISOString(),
    });
    setHasChanges(false);
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">
            Configure global application settings
          </p>
        </motion.div>

        <div className="flex gap-3">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-orange-300 bg-orange-50">
            <CardContent className="p-4">
              <p className="text-sm text-orange-800">
                You have unsaved changes. Click "Save Changes" to apply them.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Branch Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="w-5 h-5" />
                Branch Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Multiple Branches</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Allow creating and managing multiple store locations
                  </p>
                </div>
                <Switch
                  checked={settings.allowMultipleBranches}
                  onCheckedChange={(checked) => 
                    updateSetting('allowMultipleBranches', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-5 h-5" />
                Financial Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={settings.defaultCurrency}
                  onValueChange={(value) => updateSetting('defaultCurrency', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XAF">XAF (Central African CFA franc)</SelectItem>
                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label>Enable Tax Calculation</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Automatically apply tax to sales
                  </p>
                </div>
                <Switch
                  checked={settings.taxEnabled}
                  onCheckedChange={(checked) => updateSetting('taxEnabled', checked)}
                />
              </div>

              {settings.taxEnabled && (
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Approval Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-5 h-5" />
                Approval Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Expense Approval</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Expenses above limit need approval
                  </p>
                </div>
                <Switch
                  checked={settings.requireApprovalForExpenses}
                  onCheckedChange={(checked) => 
                    updateSetting('requireApprovalForExpenses', checked)
                  }
                />
              </div>

              {settings.requireApprovalForExpenses && (
                <div>
                  <Label htmlFor="approvalLimit">
                    Approval Limit ({settings.defaultCurrency})
                  </Label>
                  <Input
                    id="approvalLimit"
                    type="number"
                    min="0"
                    step="1000"
                    value={settings.expenseApprovalLimit}
                    onChange={(e) => 
                      updateSetting('expenseApprovalLimit', parseInt(e.target.value) || 0)
                    }
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Expenses above this amount will require admin approval
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-5 h-5" />
                Alert Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Get notified when inventory is low
                  </p>
                </div>
                <Switch
                  checked={settings.lowStockAlertEnabled}
                  onCheckedChange={(checked) => 
                    updateSetting('lowStockAlertEnabled', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Receipt Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt className="w-5 h-5" />
                Receipt Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                <Textarea
                  id="receiptFooter"
                  placeholder="Message to display at the bottom of receipts"
                  value={settings.receiptFooterText}
                  onChange={(e) => updateSetting('receiptFooterText', e.target.value)}
                  className="mt-2 min-h-[80px]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  This text will appear at the bottom of all receipts
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Main color used throughout the application
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateSetting('primaryColor', color)}
                    className="w-full h-10 rounded-lg border-2 hover:scale-105 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: settings.primaryColor === color ? '#000' : 'transparent'
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  Settings are saved locally and synced across your devices when online.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Last updated: {new Date(settings.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
