
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

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
          
          {/* Services Dropdown */}
          <div className="relative group">
            <button 
              className="px-3 py-2 text-white hover:text-crypto-orange transition-colors flex items-center"
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
            >
              الخدمات
              <ChevronDown className="mr-1 h-4 w-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-crypto-darkGray glass-morphism rounded-md shadow-lg py-1 hidden group-hover:block">
              <a href="#" className="block px-4 py-2 text-sm text-white hover:text-crypto-orange transition-colors">البلوكتشين</a>
              <a href="#" className="block px-4 py-2 text-sm text-white hover:text-crypto-orange transition-colors">العملات المشفرة</a>
              <a href="#" className="block px-4 py-2 text-sm text-white hover:text-crypto-orange transition-colors">الـ NFTs</a>
              <a href="#" className="block px-4 py-2 text-sm text-white hover:text-crypto-orange transition-colors">تطوير الويب 3</a>
            </div>
          </div>
          
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
            
            {/* Mobile Services Dropdown */}
            <div>
              <button 
                className="flex justify-between w-full px-3 py-2 text-white hover:text-crypto-orange transition-colors"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                <span>الخدمات</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {servicesDropdownOpen && (
                <div className="pr-4 mt-1 space-y-1">
                  <a href="#" className="block px-3 py-2 text-sm text-white hover:text-crypto-orange transition-colors">البلوكتشين</a>
                  <a href="#" className="block px-3 py-2 text-sm text-white hover:text-crypto-orange transition-colors">العملات المشفرة</a>
                  <a href="#" className="block px-3 py-2 text-sm text-white hover:text-crypto-orange transition-colors">الـ NFTs</a>
                  <a href="#" className="block px-3 py-2 text-sm text-white hover:text-crypto-orange transition-colors">تطوير الويب 3</a>
                </div>
              )}
            </div>
            
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
