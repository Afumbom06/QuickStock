import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-3">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. This area is restricted to administrators only.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline">
                <Link to="/">Go to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link to="/settings">Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
