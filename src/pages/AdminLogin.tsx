
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminAuth from '@/components/AdminAuth';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <div className="min-h-screen bg-crypto-darkBlue flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-red-900/30 rounded-full mb-4">
          <ShieldAlert className="h-8 w-8 text-crypto-orange" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">منطقة محمية</h1>
        <p className="text-white/70">هذه المنطقة مخصصة للمشرفين فقط. يرجى تسجيل الدخول للمتابعة.</p>
      </div>
      <AdminAuth />
    </div>
  );
};

export default AdminLogin;
