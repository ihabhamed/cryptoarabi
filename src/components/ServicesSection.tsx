
import React from 'react';
import { 
  Wallet, 
  BarChart3, 
  Layers, 
  Shield, 
  Code 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useServices } from '@/lib/hooks';

const ServicesSection = () => {
  const { data: servicesData, isLoading } = useServices();
  
  // Default services to show if data is loading or not available
  const defaultServices = [
    {
      title: "تداول العملات المشفرة",
      description: "احصل على إرشادات وتحليلات متخصصة في تداول العملات المشفرة وإدارة المحافظ الاستثمارية الرقمية.",
      icon: Wallet
    },
    {
      title: "التحليل الفني",
      description: "نقدم تحليلات فنية وأساسية للعملات المشفرة لمساعدتك في اتخاذ قرارات استثمارية مبنية على معلومات دقيقة.",
      icon: BarChart3
    },
    {
      title: "تطوير البلوكتشين",
      description: "خدمات برمجة وتطوير تطبيقات البلوكتشين والعقود الذكية بأحدث التقنيات وأفضل الممارسات.",
      icon: Layers
    },
    {
      title: "الأمن والحماية",
      description: "حلول أمنية متخصصة لحماية الأصول الرقمية ومحافظ العملات المشفرة من التهديدات الإلكترونية.",
      icon: Shield
    }
  ];

  // Map database service icons to Lucide icons
  const iconMap: Record<string, React.ElementType> = {
    'wallet': Wallet,
    'chart': BarChart3,
    'layers': Layers,
    'shield': Shield,
    'code': Code,
    // Default to Layers if no icon specified
    'default': Layers
  };

  // Map database services to the format needed for rendering
  const services = isLoading || !servicesData 
    ? defaultServices 
    : servicesData.map(service => ({
        title: service.title,
        description: service.description || '',
        // Use the mapped icon or default to Layers
        icon: iconMap[service.image_url || 'default'] || Layers
      }));

  return (
    <section id="services" className="section-padding bg-crypto-darkGray relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-crypto-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-crypto-lightBlue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">خدماتنا المتميزة</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            نقدم باقة من الخدمات المتخصصة في مجال العملات المشفرة والبلوكتشين لمساعدتك على النجاح في عالم الويب 3.0
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="crypto-card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-crypto-orange/10 rounded-full mb-6">
                <service.icon className="w-8 h-8 text-crypto-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <a href="#" className="text-crypto-orange hover:text-crypto-orange/80 mt-auto font-medium">اقرأ المزيد</a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white py-6 px-8 rounded-lg text-lg">
            استكشف جميع الخدمات
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
