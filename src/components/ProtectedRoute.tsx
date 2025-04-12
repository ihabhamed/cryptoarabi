
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/lib/hooks';
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!loading) {
        setIsVerifying(true);
        
        // Get the current session to ensure we have the most up-to-date auth state
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user) {
          console.log('ProtectedRoute: No user in session, redirecting to login');
          setIsVerifying(false);
          return;
        }
        
        try {
          console.log('ProtectedRoute: Starting admin verification for user', currentSession.user.id);
          
          // Direct call to supabase RPC for admin check
          const { data: isUserAdmin, error } = await supabase.rpc('is_admin');
          
          if (error) {
            console.error("Error checking admin status:", error);
            throw error;
          }
          
          console.log('ProtectedRoute: Admin check result:', isUserAdmin);
          
          if (!isUserAdmin) {
            console.log('ProtectedRoute: User is not an admin, redirecting to login');
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
      }
    };
    
    verifyAdminStatus();
  }, [user, loading, navigate, toast]);
  
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
