// Multi-language support (English & French)
export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    sales: 'Sales',
    expenses: 'Expenses',
    inventory: 'Inventory',
    customers: 'Customers',
    reports: 'Reports',
    settings: 'Settings',
    
    // Dashboard
    todaySales: "Today's Sales",
    todayExpenses: "Today's Expenses",
    todayProfit: "Today's Profit",
    lowStock: 'Low Stock Alerts',
    addSale: 'Add Sale',
    addExpense: 'Add Expense',
    addStock: 'Add Stock',
    weeklySales: 'Weekly Sales',
    syncPending: 'Sync Pending',
    
    // Sales
    salesHistory: 'Sales History',
    newSale: 'New Sale',
    itemName: 'Item Name',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    paymentType: 'Payment Type',
    cash: 'Cash',
    momo: 'Mobile Money',
    customerNote: 'Customer Note',
    saveSale: 'Save Sale',
    
    // Expenses
    expenseList: 'Expense List',
    newExpense: 'New Expense',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',
    transport: 'Transport',
    restock: 'Restock',
    bills: 'Bills',
    other: 'Other',
    
    // Inventory
    inventoryList: 'Inventory List',
    addItem: 'Add Item',
    editItem: 'Edit Item',
    costPrice: 'Cost Price',
    sellingPrice: 'Selling Price',
    stockLevel: 'Stock Level',
    lowStockThreshold: 'Low Stock Threshold',
    
    // Customers & Debt
    customerList: 'Customer List',
    addCustomer: 'Add Customer',
    customerName: 'Customer Name',
    phone: 'Phone',
    totalDebt: 'Total Debt',
    addDebt: 'Add Debt',
    markPaid: 'Mark as Paid',
    paymentHistory: 'Payment History',
    
    // Reports
    dailySummary: 'Daily Summary',
    weeklySummary: 'Weekly Summary',
    topSellingItems: 'Top Selling Items',
    netProfit: 'Net Profit',
    
    // Settings
    shopInfo: 'Shop Information',
    shopName: 'Shop Name',
    currency: 'Currency',
    theme: 'Theme',
    language: 'Language',
    backup: 'Backup & Sync',
    manualSync: 'Manual Sync',
    exportData: 'Export Data',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    loading: 'Loading...',
    offline: 'You are offline',
    online: 'Back online',
    syncNow: 'Sync Now',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    sales: 'Ventes',
    expenses: 'Dépenses',
    inventory: 'Inventaire',
    customers: 'Clients',
    reports: 'Rapports',
    settings: 'Paramètres',
    
    // Dashboard
    todaySales: "Ventes d'aujourd'hui",
    todayExpenses: "Dépenses d'aujourd'hui",
    todayProfit: "Profit d'aujourd'hui",
    lowStock: 'Alertes de stock bas',
    addSale: 'Ajouter vente',
    addExpense: 'Ajouter dépense',
    addStock: 'Ajouter stock',
    weeklySales: 'Ventes hebdomadaires',
    syncPending: 'Sync en attente',
    
    // Sales
    salesHistory: 'Historique des ventes',
    newSale: 'Nouvelle vente',
    itemName: 'Nom de l\'article',
    quantity: 'Quantité',
    price: 'Prix',
    total: 'Total',
    paymentType: 'Type de paiement',
    cash: 'Espèces',
    momo: 'Mobile Money',
    customerNote: 'Note client',
    saveSale: 'Enregistrer la vente',
    
    // Expenses
    expenseList: 'Liste des dépenses',
    newExpense: 'Nouvelle dépense',
    category: 'Catégorie',
    amount: 'Montant',
    description: 'Description',
    transport: 'Transport',
    restock: 'Réappro',
    bills: 'Factures',
    other: 'Autre',
    
    // Inventory
    inventoryList: 'Liste d\'inventaire',
    addItem: 'Ajouter article',
    editItem: 'Modifier article',
    costPrice: 'Prix de revient',
    sellingPrice: 'Prix de vente',
    stockLevel: 'Niveau de stock',
    lowStockThreshold: 'Seuil de stock bas',
    
    // Customers & Debt
    customerList: 'Liste des clients',
    addCustomer: 'Ajouter client',
    customerName: 'Nom du client',
    phone: 'Téléphone',
    totalDebt: 'Dette totale',
    addDebt: 'Ajouter dette',
    markPaid: 'Marquer comme payé',
    paymentHistory: 'Historique de paiement',
    
    // Reports
    dailySummary: 'Résumé quotidien',
    weeklySummary: 'Résumé hebdomadaire',
    topSellingItems: 'Articles les plus vendus',
    netProfit: 'Bénéfice net',
    
    // Settings
    shopInfo: 'Informations boutique',
    shopName: 'Nom de la boutique',
    currency: 'Devise',
    theme: 'Thème',
    language: 'Langue',
    backup: 'Sauvegarde & Sync',
    manualSync: 'Sync manuelle',
    exportData: 'Exporter données',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    close: 'Fermer',
    loading: 'Chargement...',
    offline: 'Vous êtes hors ligne',
    online: 'De retour en ligne',
    syncNow: 'Synchroniser',
    today: "Aujourd'hui",
    yesterday: 'Hier',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
