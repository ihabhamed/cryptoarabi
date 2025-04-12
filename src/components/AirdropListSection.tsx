
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

// Mock data for airdrops
const airdrops = [
  {
    id: 1,
    title: "إيردروب بلوكتشين الهيليوم",
    description: "احصل على رموز HNT المجانية من خلال المشاركة في مهام بسيطة على منصة الهيليوم. تعلم كيفية بناء شبكة لاسلكية واكسب المكافآت.",
    startDate: "2025/05/01",
    endDate: "2025/06/01",
    twitterLink: "https://twitter.com/helium/status/1234567890",
    youtubeLink: "https://youtube.com/watch?v=abcdefg",
    isActive: true,
  },
  {
    id: 2,
    title: "إيردروب سولانا SOL",
    description: "انضم إلى إيردروب سولانا الحصري وكن من أوائل المستخدمين لبروتوكول DeFi الجديد. استخدم المنصة واكسب رموز SOL.",
    startDate: "2025/04/15",
    endDate: "2025/05/15",
    twitterLink: "https://twitter.com/solana/status/0987654321",
    youtubeLink: "",
    isActive: true,
  },
  {
    id: 3,
    title: "إيردروب أربيتروم ARB",
    description: "احصل على رموز ARB عن طريق المشاركة في شبكة أربيتروم واستخدام تطبيقات L2. استكشف عالم Arbitrum وتعلم كيفية الاستفادة من تقنية Layer 2.",
    startDate: "2025/03/10",
    endDate: "2025/04/10",
    twitterLink: "https://twitter.com/arbitrum/status/1122334455",
    youtubeLink: "https://youtube.com/watch?v=hijklmn",
    isActive: false,
  },
  {
    id: 4,
    title: "إيردروب أوبتيميزم OP",
    description: "اربح رموز OP من خلال استخدام شبكة أوبتيميزم والتفاعل مع النظام البيئي. تعرف على مزايا تقنية Layer 2 واكسب المكافآت.",
    startDate: "2025/04/01",
    endDate: "2025/05/01",
    twitterLink: "https://twitter.com/optimismFND/status/1122334455",
    youtubeLink: "https://youtube.com/watch?v=opfnd",
    isActive: true,
  },
];

const AirdropListSection = () => {
  // State to track which airdrop is expanded
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            <Card className={`bg-crypto-darkGray border-white/10 transition-all duration-300 hover:border-crypto-orange/50 ${!airdrop.isActive ? 'opacity-80' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-xl">{airdrop.title}</CardTitle>
                  {airdrop.isActive ? (
                    <Badge className="bg-green-600 hover:bg-green-700">نشط</Badge>
                  ) : (
                    <Badge className="bg-gray-600 hover:bg-gray-700">منتهي</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-white/70 mt-2">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>
                    {airdrop.startDate} - {airdrop.endDate}
                  </span>
                </div>
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
                    {airdrop.twitterLink && (
                      <a 
                        href={airdrop.twitterLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-crypto-orange flex items-center gap-2 text-sm"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>رابط تويتر</span>
                        <ExternalLink className="h-3 w-3 mr-auto" />
                      </a>
                    )}
                    
                    {airdrop.youtubeLink && (
                      <a 
                        href={airdrop.youtubeLink} 
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
                {airdrop.isActive ? (
                  <Button className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white">
                    <Rocket className="h-4 w-4 ml-2" />
                    المطالبة بالإيردروب
                  </Button>
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
