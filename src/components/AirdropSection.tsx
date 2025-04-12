
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";

// Mock data for airdrops on homepage (showing only 4 latest)
const latestAirdrops = [
  {
    id: 1,
    title: "إيردروب بلوكتشين الهيليوم",
    description: "احصل على رموز HNT المجانية من خلال المشاركة في مهام بسيطة على منصة الهيليوم.",
    startDate: "2025/05/01",
    endDate: "2025/06/01",
    isActive: true,
  },
  {
    id: 2,
    title: "إيردروب سولانا SOL",
    description: "انضم إلى إيردروب سولانا الحصري وكن من أوائل المستخدمين لبروتوكول DeFi الجديد.",
    startDate: "2025/04/15",
    endDate: "2025/05/15",
    isActive: true,
  },
  {
    id: 3,
    title: "إيردروب أربيتروم ARB",
    description: "احصل على رموز ARB عن طريق المشاركة في شبكة أربيتروم واستخدام تطبيقات L2.",
    startDate: "2025/03/10",
    endDate: "2025/04/10",
    isActive: false,
  },
  {
    id: 4,
    title: "إيردروب أوبتيميزم OP",
    description: "اربح رموز OP من خلال استخدام شبكة أوبتيميزم والتفاعل مع النظام البيئي.",
    startDate: "2025/04/01",
    endDate: "2025/05/01",
    isActive: true,
  }
];

const AirdropSection = () => {
  return (
    <section className="section-padding bg-crypto-darkGray/50">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 md:mb-0">أحدث الإيردروبات</h2>
          <Link to="/airdrop">
            <Button variant="outline" className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange hover:text-white transition-colors duration-300">
              عرض جميع الإيردروبات
              <ExternalLink className="h-4 w-4 mr-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestAirdrops.map((airdrop) => (
            <Card 
              key={airdrop.id} 
              className="bg-crypto-darkGray border-white/10 transition-all duration-300 hover:border-crypto-orange/50 hover:translate-y-[-5px]"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg line-clamp-1">{airdrop.title}</CardTitle>
                  {airdrop.isActive ? (
                    <Badge className="bg-green-600 hover:bg-green-700 text-xs">نشط</Badge>
                  ) : (
                    <Badge className="bg-gray-600 hover:bg-gray-700 text-xs">منتهي</Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-white/70 mt-2">
                  <Calendar className="h-3 w-3 ml-1" />
                  <span>
                    {airdrop.startDate}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-white/80 text-sm line-clamp-2">{airdrop.description}</p>
              </CardContent>
              <CardFooter>
                <Link to="/airdrop" className="w-full">
                  <Button 
                    className="w-full bg-crypto-orange/10 hover:bg-crypto-orange text-crypto-orange hover:text-white border border-crypto-orange/30 transition-colors duration-300"
                  >
                    معرفة المزيد
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AirdropSection;
