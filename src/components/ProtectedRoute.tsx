
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
          console.log('ProtectedRoute: Starting admin verification');
          // Try to check admin status up to 5 times with increasing delays
          let isUserAdmin = false;
          let retries = 5;
          let delay = 500;
          
          while (retries > 0 && !isUserAdmin) {
            console.log(`ProtectedRoute: Admin check attempt ${6-retries} for user ${user.id}`);
            isUserAdmin = await checkIsAdmin();
            console.log(`ProtectedRoute: Admin check result (retry ${6-retries}):`, isUserAdmin);
            
            if (!isUserAdmin && retries > 1) {
              console.log(`Waiting ${delay}ms before retry...`);
              // Wait with increasing delay before retrying
              await new Promise(resolve => setTimeout(resolve, delay));
              delay = Math.min(delay * 1.5, 2000); // Increase delay but cap at 2 seconds
            }
            retries--;
          }
          
          if (!isUserAdmin) {
            console.log('ProtectedRoute: User is not admin after all retries');
            toast({
              variant: "destructive",
              title: "خطأ في الوصول",
              description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
            });
            navigate('/admin/login');
          } else {
            console.log('ProtectedRoute: User verified as admin');
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
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }
  
  if (!isAdmin) {
    console.log('ProtectedRoute: User not admin, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log('ProtectedRoute: Access granted to admin area');
  return <>{children}</>;
};

export default ProtectedRoute;
