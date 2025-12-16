// Extended types for multi-branch admin system

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  synced?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'cashier' | 'inventory_manager' | 'sales_rep';
  branchId: string;
  permissions: StaffPermissions;
  status: 'active' | 'inactive';
  createdAt: string;
  synced?: boolean;
}

export interface StaffPermissions {
  canMakeSales: boolean;
  canAddExpenses: boolean;
  canManageInventory: boolean;
  canViewReports: boolean;
  canManageCustomers: boolean;
  canDeleteRecords: boolean;
}

export interface SystemSettings {
  id: string;
  allowMultipleBranches: boolean;
  requireApprovalForExpenses: boolean;
  expenseApprovalLimit: number;
  lowStockAlertEnabled: boolean;
  defaultCurrency: string;
  taxEnabled: boolean;
  taxRate: number;
  receiptFooterText: string;
  businessLogo?: string;
  primaryColor: string;
  updatedAt: string;
}

export interface BranchStats {
  branchId: string;
  branchName: string;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  inventoryValue: number;
  lowStockItems: number;
  totalCustomers: number;
  totalDebt: number;
  salesCount: number;
  topSellingItem?: {
    name: string;
    quantity: number;
  };
}
