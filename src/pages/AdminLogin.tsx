
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminAuth from '@/components/AdminAuth';
import { useAuth } from '@/context/AuthContext';

const AdminLogin = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-darkBlue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/admin" replace />;
  }
  
  return <AdminAuth />;
};

export default AdminLogin;
