
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import AdminMobileMenu from './AdminMobileMenu';

interface AdminHeaderProps {
  handleSignOut: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ handleSignOut, open, setOpen }) => {
  return (
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
              <AdminMobileMenu setOpen={setOpen} handleSignOut={handleSignOut} />
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
  );
};

export default AdminHeader;
