
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import { useAirdrops } from '@/lib/supabase-hooks';
import { Airdrop } from '@/types/supabase';

const AirdropSection = () => {
  const { data: airdrops = [], isLoading, error } = useAirdrops();
  
  // Show only 4 latest airdrops for homepage
  const latestAirdrops = airdrops.slice(0, 4);

  if (isLoading) {
    return (
      <section className="section-padding bg-crypto-darkGray/50">
        <div className="container-custom mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 md:mb-0">أحدث الإيردروبات</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-crypto-darkGray border-white/10 animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-700 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading airdrops:', error);
    return (
      <section className="section-padding bg-crypto-darkGray/50">
        <div className="container-custom mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4 md:mb-0">أحدث الإيردروبات</h2>
          </div>
          <p className="text-center text-red-500">حدث خطأ أثناء تحميل الإيردروبات. يرجى المحاولة مرة أخرى لاحقًا.</p>
        </div>
      </section>
    );
  }

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
          {latestAirdrops.length > 0 ? (
            latestAirdrops.map((airdrop: Airdrop) => (
              <Card 
                key={airdrop.id} 
                className="bg-crypto-darkGray border-white/10 transition-all duration-300 hover:border-crypto-orange/50 hover:translate-y-[-5px]"
              >
                {airdrop.image_url && (
                  <div className="w-full h-40 overflow-hidden">
                    <img 
                      src={airdrop.image_url} 
                      alt={airdrop.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg line-clamp-1">{airdrop.title}</CardTitle>
                    {airdrop.status === 'active' ? (
                      <Badge className="bg-green-600 hover:bg-green-700 text-xs">نشط</Badge>
                    ) : (
                      <Badge className="bg-gray-600 hover:bg-gray-700 text-xs">منتهي</Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-white/70 mt-2">
                    <Calendar className="h-3 w-3 ml-1" />
                    <span>
                      {airdrop.start_date && new Date(airdrop.start_date).toLocaleDateString('ar-SA')}
                      {airdrop.end_date && ` - ${new Date(airdrop.end_date).toLocaleDateString('ar-SA')}`}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-white/80 text-sm line-clamp-2">{airdrop.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to={`/airdrop/${airdrop.id}`} className="w-full">
                    <Button 
                      className="w-full bg-crypto-orange/10 hover:bg-crypto-orange text-crypto-orange hover:text-white border border-crypto-orange/30 transition-colors duration-300"
                    >
                      معرفة المزيد
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-white/70">لا توجد إيردروبات متاحة حاليًا.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AirdropSection;
