import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/lib/utils/toast-utils";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        console.log('AdminAuth: User logged in successfully:', data.user.id);
        
        // Wait longer for session to be fully established
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Multiple attempts to check admin status with increasing delays
        let isAdmin = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`AdminAuth: Admin check attempt ${attempt}/3`);
          
          // Wait between attempts with increasing intervals
          if (attempt > 1) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1500));
          }
          
          // Use a stored session here rather than the context directly
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          if (!currentSession?.user) {
            console.log('AdminAuth: No user in session during admin check');
            continue;
          }
          
          console.log('AdminAuth: Checking with session user:', currentSession.user.id);
          isAdmin = await checkIsAdmin();
          console.log(`AdminAuth: Is user admin? (attempt ${attempt})`, isAdmin);
          
          if (isAdmin) {
            toast({
              title: "تم تسجيل الدخول بنجاح",
              description: "مرحبا بك في لوحة التحكم",
            });
            navigate('/admin');
            break;
          }
        }
        
        if (!isAdmin) {
          console.log('AdminAuth: User is not an admin, signing out');
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
