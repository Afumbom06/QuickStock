// IndexedDB wrapper for offline-first data storage
const DB_NAME = 'MiniERPDB';
const DB_VERSION = 1;

export interface Sale {
  id: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
  paymentType: 'cash' | 'momo' | 'credit';
  customerNote?: string;
  customerName?: string;
  // Optional richer sale structure used in UI
  items?: Array<{ id?: string; itemId?: string; name?: string; quantity?: number; price?: number }>;
  currency?: string;
  paymentMethod?: string;
  date: string;
  synced: boolean;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  receipt?: string; // Base64 encoded image or URL
  synced: boolean;
  currency?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockAlert: number;
  synced: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  synced: boolean;
  totalDebt?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DebtRecord {
  id: string;
  customerId: string;
  type: 'credit' | 'payment';
  amount: number;
  description?: string;
  date: Date;
  dueDate?: Date; // When payment is expected (for credits)
  collectedAmount?: number; // Partial payment amount (for payments)
  synced: boolean;
}

export interface User {
  id: string;
  email: string;
  shopName: string;
  ownerName?: string;
  phone: string;
  address?: string;
  logo?: string;
  currency: string;
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  // Additional optional fields used by the UI
  name?: string;
  businessName?: string;
  shopCategory?: string;
  description?: string;
  website?: string;
  taxId?: string;
  createdAt?: string;
}

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('sales')) {
          db.createObjectStore('sales', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('expenses')) {
          db.createObjectStore('expenses', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customers')) {
          db.createObjectStore('customers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('debts')) {
          db.createObjectStore('debts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly') {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async add<T>(storeName: string, data: T): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();