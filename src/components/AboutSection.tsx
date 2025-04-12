
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const AboutSection = () => {
  const features = [
    "فريق من الخبراء المتخصصين في البلوكتشين والعملات المشفرة",
    "أكثر من 5 سنوات من الخبرة في مجال الويب 3.0",
    "استشارات مخصصة لاحتياجات عملك الفريدة",
    "دعم فني على مدار الساعة طوال أيام الأسبوع"
  ];

  return (
    <section id="about" className="section-padding bg-crypto-darkBlue relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-crypto-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crypto-lightBlue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-crypto-orange/20 to-crypto-lightBlue/20 rounded-2xl blur-xl"></div>
              <div className="relative glass-morphism rounded-2xl p-6">
                <img 
                  src="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Crypto team" 
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-crypto-orange/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-crypto-lightBlue/20 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="md:w-1/2 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">من نحن</h2>
            <p className="text-gray-300 mb-6">
              نحن فريق من الخبراء المتخصصين في مجال العملات المشفرة والبلوكتشين والويب 3.0. مهمتنا هي تبسيط هذه التقنيات المعقدة وجعلها في متناول الجميع من خلال تقديم المعلومات والاستشارات والخدمات المتخصصة.
            </p>
            <p className="text-gray-300 mb-8">
              تأسست شركتنا في عام 2018، ومنذ ذلك الحين نحن نعمل على تطوير وتقديم حلول مبتكرة لمساعدة الأفراد والشركات على الاستفادة من تقنية البلوكتشين في أعمالهم ومشاريعهم.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-crypto-orange/20 rounded-full flex items-center justify-center mr-3">
                    <Check className="h-4 w-4 text-crypto-orange" />
                  </span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white">
              اعرف المزيد عنا
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
