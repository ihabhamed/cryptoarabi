
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { useFooterLinks } from '@/lib/hooks/useFooterLinks';
import { useSocialLinks } from '@/lib/hooks/useSocialLinks';

const Footer = () => {
  const { data: siteSettings } = useSiteSettings();
  const { data: footerLinks } = useFooterLinks();
  const { data: socialLinks } = useSocialLinks();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Group footer links by category
  const quickLinks = footerLinks?.filter(link => link.category === 'quick_links').sort((a, b) => a.sort_order - b.sort_order) || [];
  const serviceLinks = footerLinks?.filter(link => link.category === 'services').sort((a, b) => a.sort_order - b.sort_order) || [];
  const legalLinks = footerLinks?.filter(link => link.category === 'legal').sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <footer className="bg-crypto-darkBlue relative">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-crypto-darkGray to-transparent"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-crypto-orange/5 rounded-full blur-3xl"></div>
      </div>

      {/* Scroll to top button */}
      <div className="container-custom relative">
        <div className="flex justify-end py-4">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-crypto-orange text-white hover:bg-crypto-orange/80 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="container-custom relative z-10 pt-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <a href="#" className="text-2xl font-bold text-white mb-6 inline-block">
              {siteSettings?.site_name || 'كريبتو'}<span className="text-crypto-orange">عرب</span>
            </a>
            <p className="text-gray-400 mb-6">
              {siteSettings?.footer_description || 'منصة عربية متخصصة في تقديم المعلومات والخدمات في مجال العملات المشفرة والبلوكتشين والويب 3.0'}
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks?.map(social => (
                <a key={social.id} href={social.url} className="text-gray-400 hover:text-crypto-orange transition-colors">
                  <div dangerouslySetInnerHTML={{ __html: social.icon }} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="text-gray-400 hover:text-crypto-orange transition-colors">{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-6">خدماتنا</h3>
            <ul className="space-y-3">
              {serviceLinks.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="text-gray-400 hover:text-crypto-orange transition-colors">{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-6">النشرة الإخبارية</h3>
            <p className="text-gray-400 mb-4">
              اشترك في نشرتنا الإخبارية للحصول على آخر الأخبار والتحديثات
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-grow bg-crypto-darkGray text-white rounded-r-none rounded-l-lg border border-white/10 border-l-0 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crypto-orange/50 focus:border-transparent"
              />
              <button className="bg-crypto-orange text-white px-4 py-3 rounded-l-none rounded-r-lg hover:bg-crypto-orange/80 transition-colors">
                اشتراك
              </button>
            </div>
          </div>
        </div>
        
        <hr className="border-white/10 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {siteSettings?.site_name || 'كريبتوعرب'}. جميع الحقوق محفوظة.
          </p>
          
          <ul className="flex space-x-6 space-x-reverse text-sm">
            {legalLinks.map(link => (
              <li key={link.id}>
                <a href={link.url} className="text-gray-400 hover:text-crypto-orange transition-colors">{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
