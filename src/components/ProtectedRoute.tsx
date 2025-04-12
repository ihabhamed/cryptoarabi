
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin, checkIsAdmin } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (user && !isAdmin) {
        const isUserAdmin = await checkIsAdmin();
        if (!isUserAdmin) {
          toast({
            variant: "destructive",
            title: "خطأ في الوصول",
            description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
          });
        }
      }
    };
    
    if (user) {
      verifyAdminStatus();
    }
  }, [user, isAdmin]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
