
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: 1,
      title: "تداول العملات المشفرة",
      description: "خدمات استشارية متخصصة في تداول العملات المشفرة وإدارة المحافظ الاستثمارية الرقمية مع تحليلات فنية وأساسية.",
    },
    {
      id: 2,
      title: "تطوير البلوكتشين",
      description: "تطوير تطبيقات لامركزية والعقود الذكية على مختلف شبكات البلوكتشين مع دعم كامل للتوثيق والاختبار.",
    },
    {
      id: 3,
      title: "استشارات الويب 3.0",
      description: "خدمات استشارية لمساعدة الشركات على الانتقال إلى تقنيات الويب 3.0 والاستفادة من الفرص المتاحة في هذا المجال.",
    },
    {
      id: 4,
      title: "حماية الأصول الرقمية",
      description: "حلول أمنية متكاملة لحماية المحافظ والأصول الرقمية من الاختراقات والتهديدات الإلكترونية المختلفة.",
    },
    {
      id: 5,
      title: "تعليم العملات المشفرة",
      description: "دورات تدريبية وورش عمل متخصصة لتعليم أساسيات ومتقدمات العملات المشفرة والتداول الآمن.",
    },
    {
      id: 6,
      title: "تسويق مشاريع الويب 3.0",
      description: "حلول تسويقية متكاملة لمشاريع العملات المشفرة والـ NFT وتطبيقات البلوكتشين المختلفة.",
    },
  ];

  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">خدماتنا</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات المتخصصة في مجال البلوكتشين والعملات المشفرة لمساعدتك على النجاح في عالم الويب 3.0، سواء كنت فردًا أو شركة تتطلع للاستفادة من هذه التقنيات الثورية.
            </p>
          </div>

          {/* Services Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="crypto-card hover:translate-y-[-8px] bg-crypto-darkGray border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="text-crypto-orange hover:text-crypto-orange/80 bg-transparent hover:bg-crypto-darkBlue border border-crypto-orange hover:border-crypto-orange/80">
                    التفاصيل
                    <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
