
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-crypto-darkBlue via-crypto-darkBlue to-crypto-darkGray"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFGMkMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzFhMSAxIDAgMTEwLTIgMSAxIDAgMDEwIDJ6bTEtM2ExIDEgMCAxMTAtMiAxIDEgMCAwMTAgMnptLTItLjVhLjUuNSAwIDExMC0xIC41LjUgMCAwMTAgMXpNMjkgMjZhMSAxIDAgMTEwLTIgMSAxIDAgMDEwIDJ6IiBmaWxsPSIjRjk3MzE2IiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Floating elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-crypto-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-crypto-lightBlue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-right mb-10 md:mb-0 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight text-gradient">
              مستقبل المال الرقمي <br />
              يبدأ من <span className="text-gradient-primary">هنا</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl md:mx-0 mx-auto">
              استكشف عالم العملات المشفرة والبلوكتشين مع منصتنا المتخصصة. نقدم لك أحدث المعلومات والتحليلات والاستشارات في عالم الويب 3.0
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white py-6 px-8 rounded-lg text-lg">
                ابدأ رحلتك
                <ArrowLeft className="mr-2 h-5 w-5 rtl-flip" />
              </Button>
              <Button variant="outline" className="border-white/20 hover:border-white/40 text-white py-6 px-8 rounded-lg text-lg">
                تعلم المزيد
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pr-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-crypto-orange/20 to-crypto-lightBlue/20 rounded-2xl blur-xl"></div>
              <div className="relative glass-morphism rounded-2xl p-6">
                <img 
                  src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Crypto illustration" 
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-crypto-orange/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
        
        {/* Stats or Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="glass-morphism p-6 rounded-xl text-center">
            <h3 className="text-4xl font-bold text-crypto-orange mb-2">+١٠٠ ألف</h3>
            <p className="text-gray-300">مستخدم نشط</p>
          </div>
          <div className="glass-morphism p-6 rounded-xl text-center">
            <h3 className="text-4xl font-bold text-crypto-orange mb-2">+٥٠</h3>
            <p className="text-gray-300">مشروع ناجح</p>
          </div>
          <div className="glass-morphism p-6 rounded-xl text-center">
            <h3 className="text-4xl font-bold text-crypto-orange mb-2">٢٤/٧</h3>
            <p className="text-gray-300">دعم فني</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
