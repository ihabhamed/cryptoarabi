
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkIsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('AdminAuth: Attempting login with email:', email);
      
      // Log in with credentials
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw new Error(loginError.message);
      }

      if (data?.user) {
        console.log("AdminAuth: User logged in successfully:", data.user.id);
        console.log("AdminAuth: Full user data:", data.user);
        console.log("AdminAuth: Now checking if admin...");
        
        // First, try a direct database check as a reliable fallback
        try {
          console.log('AdminAuth: Direct database check for user_id:', data.user.id);
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', data.user.id)
            .eq('role', 'admin');
            
          if (rolesError) {
            console.error('AdminAuth: Error checking user_roles directly:', rolesError);
          } else {
            console.log('AdminAuth: Direct user_roles check result:', rolesData);
            const hasAdminRole = rolesData && rolesData.length > 0;
            console.log('AdminAuth: User has admin role (direct check):', hasAdminRole);
            
            if (hasAdminRole) {
              console.log('AdminAuth: Direct check successful, user is admin');
              toast({
                title: "تم تسجيل الدخول بنجاح",
                description: "مرحبا بك في لوحة التحكم",
              });
              navigate('/admin');
              return;
            } else {
              console.log('AdminAuth: User is not admin based on direct database check');
            }
          }
        } catch (directError) {
          console.error('AdminAuth: Error during direct check:', directError);
        }
        
        // Check if the user is an admin with retry logic
        let isAdminUser = false;
        let retries = 5;
        let delay = 500;
        
        while (retries > 0 && !isAdminUser) {
          console.log(`AdminAuth: Admin check attempt ${6-retries} for user ${data.user.id}`);
          isAdminUser = await checkIsAdmin();
          console.log(`AdminAuth: Admin check result (retry ${6-retries}):`, isAdminUser);
          
          if (!isAdminUser && retries > 1) {
            console.log(`Waiting ${delay}ms before retry...`);
            // Wait with increasing delay before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * 1.5, 2000); // Increase delay but cap at 2 seconds
          } else {
            break;
          }
          retries--;
        }
        
        if (isAdminUser) {
          console.log('AdminAuth: User verified as admin, redirecting to admin panel');
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحبا بك في لوحة التحكم",
          });
          navigate('/admin');
        } else {
          console.log('AdminAuth: User is not admin after all retries, checking user_roles table again');
          
          // Try one more direct check against the database
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', data.user.id)
            .eq('role', 'admin');
            
          if (rolesError) {
            console.error('Error checking user_roles directly:', rolesError);
          } else {
            console.log('Direct user_roles check result:', rolesData);
            if (rolesData && rolesData.length > 0) {
              console.log('User has admin role (direct check), redirecting to admin panel');
              toast({
                title: "تم تسجيل الدخول بنجاح",
                description: "مرحبا بك في لوحة التحكم",
              });
              navigate('/admin');
              return;
            } else {
              console.log('User does not have admin role in database');
              
              // Check the role format in the database
              const { data: allRoles, error: allRolesError } = await supabase
                .from('user_roles')
                .select('*');
                
              if (allRolesError) {
                console.error('Error fetching all roles:', allRolesError);
              } else {
                console.log('All roles in database:', allRoles);
              }
            }
          }
          
          // Sign out if not admin
          await supabase.auth.signOut();
          throw new Error('ليس لديك صلاحية الوصول إلى لوحة التحكم');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || 'فشل تسجيل الدخول');
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error.message || 'فشل تسجيل الدخول',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-white/10 bg-crypto-darkGray/90 backdrop-blur-md text-white shadow-xl animate-fade-in-up">
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-crypto-orange">لوحة تحكم المشرف</CardTitle>
        <CardDescription className="text-white/70">
          الرجاء تسجيل الدخول للوصول إلى لوحة التحكم
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-700 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90 block">البريد الإلكتروني</label>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-crypto-darkBlue/50 border-white/20 text-white focus:border-crypto-orange/70 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90 block">كلمة المرور</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-crypto-darkBlue/50 border-white/20 text-white focus:border-crypto-orange/70 transition-all"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-white/50 pt-0">
        هذه المنطقة مخصصة للمشرفين فقط
      </CardFooter>
    </Card>
  );
};

export default AdminAuth;
