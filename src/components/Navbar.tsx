
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link to="#" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">الخدمات</Link>
          <Link to="/airdrop" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">إيردروب</Link>
          <a href="#" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">المدونة</a>
          <Link to="/contact" className="px-3 py-2 text-white hover:text-crypto-orange transition-colors">تواصل معنا</Link>
        </div>

        {/* Call to action button */}
        <Button className="hidden md:block bg-crypto-orange hover:bg-crypto-orange/80 text-white">ابدأ الآن</Button>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-white hover:text-crypto-orange"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-crypto-darkGray glass-morphism animate-slide-in-right">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-white hover:text-crypto-orange transition-colors">الرئيسية</Link>
            <Link to="#" className="block px-3 py-2 text-white hover:text-crypto-orange transition-colors">الخدمات</Link>
            <Link to="/airdrop" className="block px-3 py-2 text-white hover:text-crypto-orange transition-colors">إيردروب</Link>
            <a href="#" className="block px-3 py-2 text-white hover:text-crypto-orange transition-colors">المدونة</a>
            <Link to="/contact" className="block px-3 py-2 text-white hover:text-crypto-orange transition-colors">تواصل معنا</Link>
            <Button className="w-full mt-4 bg-crypto-orange hover:bg-crypto-orange/80 text-white">ابدأ الآن</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
