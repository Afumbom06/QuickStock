import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db, Sale, Expense, InventoryItem, Customer, DebtRecord, User } from '../utils/db';
import { useOnlineStatus, getSyncQueueCount } from '../utils/offline';
import { translations, Language, TranslationKey } from '../utils/translations';

interface AppContextType {
  user: User | null;
  setUser: (user: User) => void;
  sales: Sale[];
  expenses: Expense[];
  inventory: InventoryItem[];
  customers: Customer[];
  debts: DebtRecord[];
  isOnline: boolean;
  syncQueueCount: number;
  language: Language;
  theme: 'light' | 'dark';
  t: (key: TranslationKey) => string;
  addSale: (sale: Omit<Sale, 'id' | 'synced'>) => Promise<void>;
  updateSale: (sale: Sale) => Promise<void>;
  deleteSale: (saleId: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'synced'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'synced'>) => Promise<void>;
  updateInventoryItem: (item: InventoryItem) => Promise<void>;
  deleteInventoryItem: (itemId: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'synced'>) => Promise<void>;
  addDebt: (debt: Omit<DebtRecord, 'id' | 'synced'>) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  markDebtPaid: (debtId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  changeLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [syncQueueCount, setSyncQueueCount] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isOnline = useOnlineStatus();

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    updateSyncQueueCount();
  }, [sales, expenses, inventory, customers, debts]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const initializeApp = async () => {
    await db.init();
    await refreshData();
    
    // Load user
    const users = await db.getAll<User>('user');
    if (users.length > 0) {
      const loadedUser = users[0];
      setUserState(loadedUser);
      setLanguage(loadedUser.language || 'en');
      setTheme(loadedUser.theme || 'light');
    } else {
      // Create default user
      const defaultUser: User = {
        id: '1',
        email: 'user@shop.com',
        shopName: 'My Shop',
        phone: '',
        currency: 'XAF',
        theme: 'light',
        language: 'en',
      };
      await db.add('user', defaultUser);
      setUserState(defaultUser);
    }
  };

  const setUser = async (updatedUser: User) => {
    await db.put('user', updatedUser);
    setUserState(updatedUser);
    setLanguage(updatedUser.language);
    setTheme(updatedUser.theme);
  };

  const refreshData = async () => {
    const [salesData, expensesData, inventoryData, customersData, debtsData] = await Promise.all([
      db.getAll<Sale>('sales'),
      db.getAll<Expense>('expenses'),
      db.getAll<InventoryItem>('inventory'),
      db.getAll<Customer>('customers'),
      db.getAll<DebtRecord>('debts'),
    ]);

    setSales(salesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setExpenses(expensesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setInventory(inventoryData);
    setCustomers(customersData);
    setDebts(debtsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateSyncQueueCount = async () => {
    const count = await getSyncQueueCount();
    setSyncQueueCount(count);
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'synced'>) => {
    const sale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}-${Math.random()}`,
      synced: false,
    };
    
    await db.add('sales', sale);
    
    // Update inventory if item exists
    const item = inventory.find(i => i.name.toLowerCase() === sale.itemName.toLowerCase());
    if (item && item.quantity >= sale.quantity) {
      const updatedItem = { ...item, quantity: item.quantity - sale.quantity, synced: false };
      await db.put('inventory', updatedItem);
    }
    
    await refreshData();
  };

  const updateSale = async (sale: Sale) => {
    await db.put('sales', { ...sale, synced: false });
    await refreshData();
  };

  const deleteSale = async (saleId: string) => {
    await db.delete('sales', saleId);
    await refreshData();
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'synced'>) => {
    const expense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}-${Math.random()}`,
      synced: false,
    };
    
    await db.add('expenses', expense);
    await refreshData();
  };

  const updateExpense = async (expense: Expense) => {
    await db.put('expenses', { ...expense, synced: false });
    await refreshData();
  };

  const deleteExpense = async (expenseId: string) => {
    await db.delete('expenses', expenseId);
    await refreshData();
  };

  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'synced'>) => {
    const item: InventoryItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random()}`,
      synced: false,
    };
    
    await db.add('inventory', item);
    await refreshData();
  };

  const updateInventoryItem = async (item: InventoryItem) => {
    await db.put('inventory', { ...item, synced: false });
    await refreshData();
  };

  const deleteInventoryItem = async (itemId: string) => {
    await db.delete('inventory', itemId);
    await refreshData();
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'synced'>) => {
    const customer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}-${Math.random()}`,
      synced: false,
    };
    
    await db.add('customers', customer);
    await refreshData();
  };

  const deleteCustomer = async (customerId: string) => {
    await db.delete('customers', customerId);
    // Also delete all debts for this customer
    const customerDebts = debts.filter(d => d.customerId === customerId);
    for (const debt of customerDebts) {
      await db.delete('debts', debt.id);
    }
    await refreshData();
  };

  const addDebt = async (debtData: Omit<DebtRecord, 'id' | 'synced'>) => {
    const debt: DebtRecord = {
      ...debtData,
      id: `debt-${Date.now()}-${Math.random()}`,
      synced: false,
    };
    
    await db.add('debts', debt);
    
    // Update customer's total debt
    const customer = customers.find(c => c.id === debt.customerId);
    if (customer) {
      const updatedCustomer = {
        ...customer,
        totalDebt: customer.totalDebt + debt.amount,
        synced: false,
      };
      await db.put('customers', updatedCustomer);
    }
    
    await refreshData();
  };

  const markDebtPaid = async (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    const updatedDebt = {
      ...debt,
      paid: true,
      paidDate: new Date().toISOString(),
      synced: false,
    };
    
    await db.put('debts', updatedDebt);
    
    // Update customer's total debt
    const customer = customers.find(c => c.id === debt.customerId);
    if (customer) {
      const updatedCustomer = {
        ...customer,
        totalDebt: customer.totalDebt - debt.amount,
        synced: false,
      };
      await db.put('customers', updatedCustomer);
    }
    
    await refreshData();
  };

  const changeLanguage = (lang: Language) => {
    if (user) {
      setUser({ ...user, language: lang });
    }
  };

  const toggleTheme = () => {
    if (user) {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setUser({ ...user, theme: newTheme });
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const value: AppContextType = {
    user,
    setUser,
    sales,
    expenses,
    inventory,
    customers,
    debts,
    isOnline,
    syncQueueCount,
    language,
    theme,
    t,
    addSale,
    updateSale,
    deleteSale,
    addExpense,
    updateExpense,
    deleteExpense,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    addCustomer,
    addDebt,
    deleteCustomer,
    markDebtPaid,
    refreshData,
    changeLanguage,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}