
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "محمد أحمد",
      title: "مستثمر",
      quote: "لقد ساعدتني هذه المنصة على فهم أساسيات العملات المشفرة بطريقة سهلة ومبسطة. الاستشارات التي قدموها لي كانت قيمة للغاية وساعدتني على بناء محفظة استثمارية متنوعة.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "سارة محمود",
      title: "مديرة مشاريع",
      quote: "فريق محترف ومتخصص قدم لشركتنا حلول مبتكرة باستخدام تقنية البلوكتشين. كانوا متعاونين للغاية وساعدونا على تطبيق التقنية بسلاسة في عملياتنا.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "أحمد سمير",
      title: "مطور ويب 3",
      quote: "المحتوى التعليمي المقدم من هذه المنصة ساعدني على تطوير مهاراتي في برمجة العقود الذكية. الدورات التدريبية والمقالات كانت شاملة ومفيدة للغاية.",
      image: "https://randomuser.me/api/portraits/men/68.jpg"
    },
    {
      id: 4,
      name: "ليلى عبدالله",
      title: "مستثمرة",
      quote: "التحليلات الفنية واضحة ودقيقة، وقد ساعدتني على اتخاذ قرارات استثمارية صائبة. أنصح بشدة بالاستفادة من خدماتهم إذا كنت ترغب في الاستثمار في العملات المشفرة.",
      image: "https://randomuser.me/api/portraits/women/62.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Calculate indices for the visible testimonials (current and next)
  const secondIndex = (currentIndex + 1) % testimonials.length;
  const displayTestimonials = window.innerWidth >= 768 ? 
    [testimonials[currentIndex], testimonials[secondIndex]] : 
    [testimonials[currentIndex]];

  return (
    <section id="testimonials" className="section-padding bg-crypto-darkBlue relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-crypto-darkGray to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-crypto-darkGray to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-crypto-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-crypto-lightBlue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">آراء عملائنا</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            استمع إلى تجارب عملائنا وكيف ساعدتهم خدماتنا على النجاح في عالم العملات المشفرة والبلوكتشين
          </p>
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {displayTestimonials.map((testimonial, index) => (
              <div 
                key={`testimonial-${testimonial.id}`} 
                className="flex-1 glass-morphism p-8 rounded-xl relative"
              >
                {/* Quote icon */}
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-crypto-orange rounded-full flex items-center justify-center">
                  <Quote className="h-5 w-5 text-white" />
                </div>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">{testimonial.quote}</p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full border-2 border-crypto-orange/50 ml-4"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-crypto-orange">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 space-x-reverse mb-6">
            {testimonials.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-crypto-orange' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-crypto-darkGray hover:bg-crypto-darkGray/80 border border-white/10 text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-crypto-darkGray hover:bg-crypto-darkGray/80 border border-white/10 text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
