
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Settings, Home, Link2, FileText, 
  LogOut, Menu, X, Newspaper, Palette, Database, Gift
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

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
    <div className="min-h-screen bg-gradient-to-b from-crypto-darkBlue to-crypto-darkGray flex flex-col">
      {/* Top navigation bar */}
      <header className="bg-crypto-darkBlue/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-crypto-darkBlue border-white/10 p-0 w-[280px] text-white">
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
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center px-3 py-2 text-white hover:bg-crypto-darkBlue/50 hover:text-crypto-orange rounded-md"
                        >
                          <item.icon className="h-5 w-5 ml-3" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-3 py-2 text-white hover:bg-crypto-darkBlue/50 hover:text-crypto-orange rounded-md"
                      >
                        <LogOut className="h-5 w-5 ml-3" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
            <LayoutDashboard className="h-6 w-6 text-crypto-orange" />
            <h1 className="text-xl font-bold text-white mr-2">لوحة التحكم</h1>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-white hover:text-crypto-orange"
            >
              <LogOut className="h-5 w-5 ml-2" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
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

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
