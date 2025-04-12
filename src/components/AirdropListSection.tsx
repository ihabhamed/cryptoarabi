
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Rocket, 
  Twitter, 
  Youtube, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from 'react-router-dom';
import { useAirdrops } from '@/lib/supabase-hooks';

const AirdropListSection = () => {
  // State to track which airdrop is expanded
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: airdrops, isLoading, error } = useAirdrops();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">آخر الإيردروبات</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-crypto-darkGray border-white/10 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
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
    );
  }

  if (error) {
    console.error('Error loading airdrops:', error);
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">آخر الإيردروبات</h2>
        </div>
        <p className="text-center text-red-500 p-4">حدث خطأ أثناء تحميل الإيردروبات. يرجى المحاولة مرة أخرى لاحقًا.</p>
      </div>
    );
  }

  if (!airdrops || airdrops.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">آخر الإيردروبات</h2>
        </div>
        <Card className="bg-crypto-darkGray border-white/10 p-8 text-center">
          <p className="text-white/70">لا توجد إيردروبات متاحة حاليًا.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">آخر الإيردروبات</h2>
        
        <div className="flex gap-2">
          <Badge className="bg-green-600 hover:bg-green-700">نشط</Badge>
          <Badge className="bg-gray-600 hover:bg-gray-700">منتهي</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {airdrops.map((airdrop) => (
          <Collapsible 
            key={airdrop.id} 
            open={expandedId === airdrop.id}
            onOpenChange={() => toggleExpand(airdrop.id)}
            className="w-full"
          >
            <Card className={`bg-crypto-darkGray border-white/10 transition-all duration-300 hover:border-crypto-orange/50 ${airdrop.status !== 'active' ? 'opacity-80' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-xl">{airdrop.title}</CardTitle>
                  {airdrop.status === 'active' ? (
                    <Badge className="bg-green-600 hover:bg-green-700">نشط</Badge>
                  ) : (
                    <Badge className="bg-gray-600 hover:bg-gray-700">منتهي</Badge>
                  )}
                </div>
                {(airdrop.start_date || airdrop.end_date) && (
                  <div className="flex items-center text-sm text-white/70 mt-2">
                    <Calendar className="h-4 w-4 ml-1" />
                    <span>
                      {airdrop.start_date && new Date(airdrop.start_date).toLocaleDateString('ar-SA')}
                      {airdrop.end_date && ` - ${new Date(airdrop.end_date).toLocaleDateString('ar-SA')}`}
                    </span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <p className="text-white/80 mb-4 line-clamp-2">{airdrop.description}</p>
                
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="link" 
                    className="text-crypto-orange hover:text-crypto-orange/80 px-0 flex items-center gap-1"
                  >
                    {expandedId === airdrop.id ? (
                      <>
                        <span>عرض أقل</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>معرفة المزيد</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4 space-y-3">
                  <div className="flex flex-col gap-2">
                    {airdrop.twitter_link && (
                      <a 
                        href={airdrop.twitter_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-crypto-orange flex items-center gap-2 text-sm"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>رابط تويتر</span>
                        <ExternalLink className="h-3 w-3 mr-auto" />
                      </a>
                    )}
                    
                    {airdrop.youtube_link && (
                      <a 
                        href={airdrop.youtube_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-crypto-orange flex items-center gap-2 text-sm"
                      >
                        <Youtube className="h-4 w-4" />
                        <span>فيديو توضيحي</span>
                        <ExternalLink className="h-3 w-3 mr-auto" />
                      </a>
                    )}
                  </div>
                </CollapsibleContent>
              </CardContent>
              
              <CardFooter>
                {airdrop.status === 'active' ? (
                  airdrop.claim_url ? (
                    <a href={airdrop.claim_url} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white">
                        <Rocket className="h-4 w-4 ml-2" />
                        المطالبة بالإيردروب
                      </Button>
                    </a>
                  ) : (
                    <Link to={`/airdrop/${airdrop.id}`} className="w-full">
                      <Button className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white">
                        <Rocket className="h-4 w-4 ml-2" />
                        المطالبة بالإيردروب
                      </Button>
                    </Link>
                  )
                ) : (
                  <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white" disabled>
                    انتهى الإيردروب
                  </Button>
                )}
              </CardFooter>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default AirdropListSection;
