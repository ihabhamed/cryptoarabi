
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Settings, FileText, Link2, Database, BookOpen, Zap
} from 'lucide-react';

interface AdminSidebarProps {
  handleSignOut: () => Promise<void>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ handleSignOut }) => {
  const location = useLocation();
  
  // Nav item active style
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50";
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-crypto-darkGray border-r border-white/10 h-screen fixed">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-crypto-orange">لوحة التحكم</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink
          to="/admin"
          end
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin')}`}
        >
          <Home size={18} />
          <span>الرئيسية</span>
        </NavLink>
        <NavLink
          to="/admin/site-settings"
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin/site-settings')}`}
        >
          <Settings size={18} />
          <span>إعدادات الموقع</span>
        </NavLink>
        <NavLink
          to="/admin/links"
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin/links')}`}
        >
          <Link2 size={18} />
          <span>إدارة الروابط</span>
        </NavLink>
        <NavLink
          to="/admin/legal"
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin/legal')}`}
        >
          <FileText size={18} />
          <span>الصفحات القانونية</span>
        </NavLink>
        <NavLink
          to="/admin/services"
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin/services')}`}
        >
          <Zap size={18} />
          <span>الخدمات</span>
        </NavLink>
        <NavLink
          to="/admin/blog"
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin/blog')}`}
        >
          <BookOpen size={18} />
          <span>المدونة</span>
        </NavLink>
        <NavLink
          to="/admin/airdrops"
          className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive('/admin/airdrops')}`}
        >
          <Database size={18} />
          <span>الإيردروب</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full p-3 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors flex justify-center items-center"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
