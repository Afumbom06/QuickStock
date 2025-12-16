import { createBrowserRouter } from 'react-router';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';
import { DashboardRedirect } from '../components/DashboardRedirect';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Onboarding } from '../pages/Onboarding';
import { Dashboard } from '../pages/Dashboard';
import { Sales } from '../pages/Sales';
import { NewSale } from '../pages/NewSale';
import { SaleDetail } from '../pages/SaleDetail';
import { EditSale } from '../pages/EditSale';
import { Expenses } from '../pages/Expenses';
import { NewExpense } from '../pages/NewExpense';
import { ExpenseDetail } from '../pages/ExpenseDetail';
import { EditExpense } from '../pages/EditExpense';
import { Inventory } from '../pages/Inventory';
import { NewInventoryItem } from '../pages/NewInventoryItem';
import { EditInventoryItem } from '../pages/EditInventoryItem';
import { StockAlerts } from '../pages/StockAlerts';
import { Customers } from '../pages/Customers';
import { NewCustomer } from '../pages/NewCustomer';
import { CustomerDetail } from '../pages/CustomerDetail';
import { AddDebt } from '../pages/AddDebt';
import { Reports } from '../pages/Reports';
import { Settings } from '../pages/Settings';
import { ShopInfo } from '../pages/ShopInfo';
import { CurrencySettings } from '../pages/CurrencySettings';
import { ThemeSettings } from '../pages/ThemeSettings';
import { SyncBackup } from '../pages/SyncBackup';
import { DataExport } from '../pages/DataExport';
import { AccountSettings } from '../pages/AccountSettings';
import { DailySummary } from '../pages/DailySummary';
import { WeeklySummary } from '../pages/WeeklySummary';
import { MiniReports } from '../pages/MiniReports';
import { Profile } from '../pages/Profile';
import { AnalyticsDashboard } from '../pages/AnalyticsDashboard';
import { ActivityOverview } from '../pages/ActivityOverview';
import { AdminDashboard } from '../pages/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/onboarding',
    element: <ProtectedRoute><Onboarding /></ProtectedRoute>,
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardRedirect /></ProtectedRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>,
  },
  {
    path: '/sales',
    element: <ProtectedRoute><Layout><Sales /></Layout></ProtectedRoute>,
  },
  {
    path: '/sales/new',
    element: <ProtectedRoute><Layout><NewSale /></Layout></ProtectedRoute>,
  },
  {
    path: '/sales/:id',
    element: <ProtectedRoute><Layout><SaleDetail /></Layout></ProtectedRoute>,
  },
  {
    path: '/sales/:id/edit',
    element: <ProtectedRoute><Layout><EditSale /></Layout></ProtectedRoute>,
  },
  {
    path: '/expenses',
    element: <ProtectedRoute><Layout><Expenses /></Layout></ProtectedRoute>,
  },
  {
    path: '/expenses/new',
    element: <ProtectedRoute><Layout><NewExpense /></Layout></ProtectedRoute>,
  },
  {
    path: '/expenses/:id',
    element: <ProtectedRoute><Layout><ExpenseDetail /></Layout></ProtectedRoute>,
  },
  {
    path: '/expenses/:id/edit',
    element: <ProtectedRoute><Layout><EditExpense /></Layout></ProtectedRoute>,
  },
  {
    path: '/inventory',
    element: <ProtectedRoute><Layout><Inventory /></Layout></ProtectedRoute>,
  },
  {
    path: '/inventory/new',
    element: <ProtectedRoute><Layout><NewInventoryItem /></Layout></ProtectedRoute>,
  },
  {
    path: '/inventory/alerts',
    element: <ProtectedRoute><Layout><StockAlerts /></Layout></ProtectedRoute>,
  },
  {
    path: '/inventory/:id/edit',
    element: <ProtectedRoute><Layout><EditInventoryItem /></Layout></ProtectedRoute>,
  },
  {
    path: '/customers',
    element: <ProtectedRoute><Layout><Customers /></Layout></ProtectedRoute>,
  },
  {
    path: '/customers/new',
    element: <ProtectedRoute><Layout><NewCustomer /></Layout></ProtectedRoute>,
  },
  {
    path: '/customers/:id',
    element: <ProtectedRoute><Layout><CustomerDetail /></Layout></ProtectedRoute>,
  },
  {
    path: '/debts/add/:customerId?',
    element: <ProtectedRoute><Layout><AddDebt /></Layout></ProtectedRoute>,
  },
  {
    path: '/reports',
    element: <ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>,
  },
  {
    path: '/reports/daily',
    element: <ProtectedRoute><Layout><DailySummary /></Layout></ProtectedRoute>,
  },
  {
    path: '/reports/weekly',
    element: <ProtectedRoute><Layout><WeeklySummary /></Layout></ProtectedRoute>,
  },
  {
    path: '/reports/analytics',
    element: <ProtectedRoute><Layout><MiniReports /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings/shop-info',
    element: <ProtectedRoute><Layout><ShopInfo /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings/currency',
    element: <ProtectedRoute><Layout><CurrencySettings /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings/theme',
    element: <ProtectedRoute><Layout><ThemeSettings /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings/sync',
    element: <ProtectedRoute><Layout><SyncBackup /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings/export',
    element: <ProtectedRoute><Layout><DataExport /></Layout></ProtectedRoute>,
  },
  {
    path: '/settings/account',
    element: <ProtectedRoute><Layout><AccountSettings /></Layout></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>,
  },
  {
    path: '/analytics-dashboard',
    element: <ProtectedRoute><Layout><AnalyticsDashboard /></Layout></ProtectedRoute>,
  },
  {
    path: '/activity-overview',
    element: <ProtectedRoute><Layout><ActivityOverview /></Layout></ProtectedRoute>,
  },
  {
    path: '/admin-dashboard',
    element: <AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>,
  },
]);
