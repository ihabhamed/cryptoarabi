
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Settings, FileText, Link2, LogOut, Database, BookOpen, Zap
} from 'lucide-react';

interface AdminMobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSignOut: () => Promise<void>;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ 
  open, 
  setOpen,
  handleSignOut
}) => {
  // Close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="flex flex-col p-4 space-y-4" dir="rtl">
      <NavLink
        to="/admin"
        end
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <Home size={18} />
        <span>الرئيسية</span>
      </NavLink>
      <NavLink
        to="/admin/site-settings"
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <Settings size={18} />
        <span>إعدادات الموقع</span>
      </NavLink>
      <NavLink
        to="/admin/links"
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <Link2 size={18} />
        <span>إدارة الروابط</span>
      </NavLink>
      <NavLink
        to="/admin/legal"
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <FileText size={18} />
        <span>الصفحات القانونية</span>
      </NavLink>
      <NavLink
        to="/admin/services"
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <Zap size={18} />
        <span>الخدمات</span>
      </NavLink>
      <NavLink
        to="/admin/blog"
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <BookOpen size={18} />
        <span>المدونة</span>
      </NavLink>
      <NavLink
        to="/admin/airdrops"
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive ? "bg-crypto-orange text-white" : "text-gray-300 hover:bg-crypto-darkBlue/50"
          }`
        }
        onClick={handleLinkClick}
      >
        <Database size={18} />
        <span>الإيردروب</span>
      </NavLink>
      <button
        onClick={() => {
          handleSignOut();
          setOpen(false);
        }}
        className="flex items-center gap-3 p-3 rounded-md transition-colors text-white bg-red-500 hover:bg-red-600"
      >
        <LogOut size={18} />
        <span>تسجيل الخروج</span>
      </button>
    </nav>
  );
};

export default AdminMobileMenu;
