
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X,
  Shield
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  
  // Don't show navbar on admin pages
  if (location.pathname.includes('/admin')) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 bg-crypto-darkBlue/80 backdrop-blur-md border-b border-white/10">
      <div className="container-custom mx-auto flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-white">كريبتو<span className="text-crypto-orange">عرب</span></Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 space-x-reverse">
          <Link to="/" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">الرئيسية</Link>
          <Link to="/services" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">الخدمات</Link>
          <Link to="/airdrop" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">إيردروب</Link>
          <Link to="/blog" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">المدونة</Link>
          <Link to="/contact" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">تواصل معنا</Link>
          {isAdmin && (
            <Link to="/admin" className="px-3 py-2 flex items-center gap-1 text-crypto-orange hover:text-crypto-orange/80 transition-colors">
              <Shield className="h-4 w-4" />
              <span>لوحة التحكم</span>
            </Link>
          )}
        </div>

        {/* Call to action button */}
        <div className="hidden md:flex items-center gap-2">
          <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white">ابدأ الآن</Button>
          {isAdmin && (
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-2" />
                لوحة التحكم
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-crypto-orange p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-crypto-darkGray/95 backdrop-blur-md border-white/10 text-white w-[80%] p-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-center">
                    <Link to="/" className="text-2xl font-bold text-white">كريبتو<span className="text-crypto-orange">عرب</span></Link>
                  </div>
                </div>
                <div className="flex-1 overflow-auto py-4">
                  <div className="px-4 py-2 space-y-3">
                    <Link to="/" className="block px-2 py-3 text-white hover:text-crypto-orange transition-colors">الرئيسية</Link>
                    <Link to="/services" className="block px-2 py-3 text-white hover:text-crypto-orange transition-colors">الخدمات</Link>
                    <Link to="/airdrop" className="block px-2 py-3 text-white hover:text-crypto-orange transition-colors">إيردروب</Link>
                    <Link to="/blog" className="block px-2 py-3 text-white hover:text-crypto-orange transition-colors">المدونة</Link>
                    <Link to="/contact" className="block px-2 py-3 text-white hover:text-crypto-orange transition-colors">تواصل معنا</Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-2 py-3 text-crypto-orange hover:text-crypto-orange/80 transition-colors">
                        <Shield className="h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-white/10">
                  <Button className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white">ابدأ الآن</Button>
                  {isAdmin && (
                    <Button variant="outline" className="w-full mt-3 border-white/20 text-white hover:bg-white/10" asChild>
                      <Link to="/admin">
                        <Shield className="h-4 w-4 mr-2" />
                        لوحة التحكم
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
