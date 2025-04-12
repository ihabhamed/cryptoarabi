
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin, checkIsAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!loading && user) {
        setIsVerifying(true);
        try {
          // Try to check admin status up to 3 times
          let isUserAdmin = false;
          let retries = 3;
          
          while (retries > 0 && !isUserAdmin) {
            isUserAdmin = await checkIsAdmin();
            console.log(`ProtectedRoute admin check (retry ${4-retries}):`, isUserAdmin);
            
            if (!isUserAdmin && retries > 1) {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            retries--;
          }
          
          if (!isUserAdmin) {
            toast({
              variant: "destructive",
              title: "خطأ في الوصول",
              description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
            });
            navigate('/admin/login');
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          toast({
            variant: "destructive",
            title: "خطأ في التحقق",
            description: "حدث خطأ أثناء التحقق من صلاحياتك",
          });
          navigate('/admin/login');
        } finally {
          setIsVerifying(false);
        }
      } else if (!loading) {
        setIsVerifying(false);
      }
    };
    
    verifyAdminStatus();
  }, [user, loading]);
  
  if (loading || isVerifying) {
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
