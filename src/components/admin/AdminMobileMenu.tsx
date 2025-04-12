
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Settings, Home, Link2, FileText, 
  LogOut, X, Newspaper, Palette, Database, Gift
} from 'lucide-react';

interface AdminMobileMenuProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignOut: () => void;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ setOpen, handleSignOut }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/admin' },
    { icon: Settings, label: 'إعدادات الموقع', href: '/admin/site-settings' },
    { icon: Link2, label: 'إدارة الروابط', href: '/admin/links' },
    { icon: Gift, label: 'إدارة الإيردروب', href: '/admin/airdrops' },
    { icon: Newspaper, label: 'إدارة المدونة', href: '/admin/blog' },
    { icon: Palette, label: 'إدارة الخدمات', href: '/admin/services' },
    { icon: FileText, label: 'الصفحات القانونية', href: '/admin/legal' },
    { icon: Database, label: 'النسخ الاحتياطي', href: '/admin/backup' },
    { icon: Home, label: 'العودة للموقع', href: '/' },
  ];

  return (
    <>
      <div className="py-6 px-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-crypto-orange">لوحة التحكم</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={index}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-3 py-2 text-white rounded-md transition-colors ${
                    isActive 
                      ? 'bg-crypto-darkBlue/50 text-crypto-orange' 
                      : 'hover:bg-crypto-darkBlue/50 hover:text-crypto-orange'
                  }`}
                >
                  <item.icon className="h-5 w-5 ml-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => {
                handleSignOut();
                setOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-white hover:bg-crypto-darkBlue/50 hover:text-crypto-orange rounded-md"
            >
              <LogOut className="h-5 w-5 ml-3" />
              <span>تسجيل الخروج</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default AdminMobileMenu;
