
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-crypto-darkBlue to-crypto-darkGray flex flex-col">
      {/* Top navigation bar */}
      <AdminHeader 
        handleSignOut={handleSignOut} 
        open={open} 
        setOpen={setOpen} 
      />

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <AdminSidebar handleSignOut={handleSignOut} />

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
