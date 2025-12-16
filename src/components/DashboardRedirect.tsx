import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function DashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect based on user role
  if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
