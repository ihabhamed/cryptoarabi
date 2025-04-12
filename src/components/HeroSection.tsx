
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Animation effect for background elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const elements = backgroundRef.current.querySelectorAll('.floating-element');
      elements.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        const speed = 1 + i * 0.5;
        const xOffset = (x - 0.5) * speed * 15;
        const yOffset = (y - 0.5) * speed * 15;
        
        htmlEl.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create floating elements animation
    const interval = setInterval(() => {
      if (!backgroundRef.current) return;
      
      const floatingElements = backgroundRef.current.querySelectorAll('.pulse-animation');
      floatingElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        // Random opacity between 0.1 and 0.6
        const opacity = Math.random() * 0.5 + 0.1;
        htmlEl.style.opacity = opacity.toString();
      });
    }, 2000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      {/* Animated Background Elements */}
      <div ref={backgroundRef} className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-crypto-darkBlue via-crypto-darkBlue to-crypto-darkGray"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFGMkMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzFhMSAxIDAgMTEwLTIgMSAxIDAgMDEwIDJ6bTEtM2ExIDEgMCAxMTAtMiAxIDEgMCAwMTAgMnptLTItLjVhLjUuNSAwIDExMC0xIC41LjUgMCAwMTAgMXpNMjkgMjZhMSAxIDAgMTEwLTIgMSAxIDAgMDEwIDJ6IiBmaWxsPSIjRjk3MzE2IiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Dynamic floating elements */}
        <div className="floating-element pulse-animation absolute top-1/4 left-1/5 w-32 h-32 bg-crypto-orange/5 rounded-full blur-3xl transition-all duration-700 ease-in-out"></div>
        <div className="floating-element pulse-animation absolute bottom-1/4 right-1/5 w-48 h-48 bg-crypto-lightBlue/10 rounded-full blur-3xl transition-all duration-700 ease-in-out"></div>
        <div className="floating-element absolute -top-20 -left-20 w-60 h-60 bg-crypto-orange/8 rounded-full blur-3xl"></div>
        <div className="floating-element absolute top-1/3 -right-32 w-80 h-80 bg-crypto-lightBlue/8 rounded-full blur-3xl"></div>
        
        {/* Animated dots/particles */}
        <div className="floating-element pulse-animation absolute top-1/2 left-1/2 w-2 h-2 bg-crypto-orange rounded-full"></div>
        <div className="floating-element pulse-animation absolute top-1/3 left-1/4 w-3 h-3 bg-crypto-lightBlue rounded-full"></div>
        <div className="floating-element pulse-animation absolute top-2/3 left-3/4 w-2 h-2 bg-white/30 rounded-full"></div>
        <div className="floating-element pulse-animation absolute top-1/4 left-2/3 w-2 h-2 bg-white/20 rounded-full"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 text-center md:text-right mb-10 md:mb-0">
            <h1 
              className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight animate-fade-in"
              style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
            >
              مستقبل المال الرقمي <br />
              يبدأ من <span className="text-gradient-primary glow-text">هنا</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl md:mx-0 mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              استكشف عالم العملات المشفرة والبلوكتشين مع منصتنا المتخصصة. نقدم لك أحدث المعلومات والتحليلات والاستشارات في عالم الويب 3.0
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button 
                className="bg-crypto-orange hover:bg-crypto-orange/80 text-white py-6 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
              >
                ابدأ رحلتك
                <ArrowLeft className="mr-2 h-5 w-5 rtl-flip" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 hover:border-white/40 text-white py-6 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                تعلم المزيد
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-crypto-orange/20 to-crypto-lightBlue/20 rounded-2xl blur-xl"></div>
              <div className="floating-element relative glass-morphism rounded-2xl p-6 transition-transform duration-700 hover:translate-y-[-5px]">
                <img 
                  src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Crypto illustration" 
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
                
                {/* Animated overlay elements */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-lg bg-crypto-orange/10 backdrop-blur-sm border border-white/10 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 bg-crypto-orange/30 rounded-md"></div>
                </div>
                
                <div className="absolute bottom-8 left-8 w-16 h-16 rounded-lg bg-crypto-lightBlue/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <div className="w-10 h-10 bg-crypto-lightBlue/30 rounded-md animate-pulse"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-crypto-orange/30 rounded-full blur-2xl floating-element pulse-animation"></div>
            </div>
          </div>
        </div>
        
        {/* Stats with animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="glass-morphism p-6 rounded-xl text-center transition-transform duration-300 hover:scale-105 hover:bg-white/10">
            <h3 className="text-4xl font-bold text-crypto-orange mb-2 counter-animation">+١٠٠ ألف</h3>
            <p className="text-gray-300">مستخدم نشط</p>
          </div>
          <div className="glass-morphism p-6 rounded-xl text-center transition-transform duration-300 hover:scale-105 hover:bg-white/10">
            <h3 className="text-4xl font-bold text-crypto-orange mb-2 counter-animation">+٥٠</h3>
            <p className="text-gray-300">مشروع ناجح</p>
          </div>
          <div className="glass-morphism p-6 rounded-xl text-center transition-transform duration-300 hover:scale-105 hover:bg-white/10">
            <h3 className="text-4xl font-bold text-crypto-orange mb-2">٢٤/٧</h3>
            <p className="text-gray-300">دعم فني</p>
          </div>
        </div>
      </div>

      {/* Add CSS for the animations */}
      <style jsx>{`
        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(249, 115, 22, 0.5); }
          50% { text-shadow: 0 0 20px rgba(249, 115, 22, 0.8), 0 0 30px rgba(249, 115, 22, 0.6); }
          100% { text-shadow: 0 0 5px rgba(249, 115, 22, 0.5); }
        }
        
        .glow-text {
          animation: glow 3s infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.2; }
          50% { opacity: 0.6; }
          100% { opacity: 0.2; }
        }
        
        .pulse-animation {
          animation: pulse 4s infinite;
        }
        
        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .counter-animation {
          animation: countUp 2s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
