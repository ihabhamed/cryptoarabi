
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبا بك في لوحة التحكم",
        });
      }
    } catch (error: any) {
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
    <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue/95 p-4">
      <Card className="w-full max-w-md border border-white/10 bg-crypto-darkGray/90 backdrop-blur-md text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-crypto-orange">لوحة تحكم المشرف</CardTitle>
          <CardDescription className="text-white/70">
            الرجاء تسجيل الدخول للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-700 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">البريد الإلكتروني</label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">كلمة المرور</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-crypto-darkBlue/50 border-white/20 text-white"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-6 bg-crypto-orange hover:bg-crypto-orange/80 text-white"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-white/50">
          هذه المنطقة مخصصة للمشرفين فقط
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuth;
