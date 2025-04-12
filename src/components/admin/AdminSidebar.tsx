
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, Home, Link2, FileText, 
  LogOut, Newspaper, Palette, Database, Gift
} from 'lucide-react';

interface AdminSidebarProps {
  handleSignOut: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ handleSignOut }) => {
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
    <aside className="hidden md:block w-64 bg-crypto-darkBlue/50 border-r border-white/10 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="flex items-center px-3 py-2.5 text-white hover:bg-crypto-darkBlue/70 hover:text-crypto-orange rounded-md"
              >
                <item.icon className="h-5 w-5 ml-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2.5 text-white hover:bg-crypto-darkBlue/70 hover:text-crypto-orange rounded-md"
            >
              <LogOut className="h-5 w-5 ml-3" />
              <span>تسجيل الخروج</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
