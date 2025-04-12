
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Twitter, Youtube, Calendar } from "lucide-react";

// Mock data for airdrops
const airdrops = [
  {
    id: 1,
    title: "إيردروب بلوكتشين الهيليوم",
    description: "احصل على رموز HNT المجانية من خلال المشاركة في مهام بسيطة على منصة الهيليوم.",
    startDate: "2025/05/01",
    endDate: "2025/06/01",
    twitterLink: "https://twitter.com/helium/status/1234567890",
    youtubeLink: "https://youtube.com/watch?v=abcdefg",
    isActive: true,
  },
  {
    id: 2,
    title: "إيردروب سولانا SOL",
    description: "انضم إلى إيردروب سولانا الحصري وكن من أوائل المستخدمين لبروتوكول DeFi الجديد.",
    startDate: "2025/04/15",
    endDate: "2025/05/15",
    twitterLink: "https://twitter.com/solana/status/0987654321",
    youtubeLink: "",
    isActive: true,
  },
  {
    id: 3,
    title: "إيردروب أربيتروم ARB",
    description: "احصل على رموز ARB عن طريق المشاركة في شبكة أربيتروم واستخدام تطبيقات L2.",
    startDate: "2025/03/10",
    endDate: "2025/04/10",
    twitterLink: "https://twitter.com/arbitrum/status/1122334455",
    youtubeLink: "https://youtube.com/watch?v=hijklmn",
    isActive: false,
  },
];

const AirdropListSection = () => {
  return (
    <div className="container-custom mx-auto section-padding">
      <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-8 text-center">إيردروبات متاحة</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {airdrops.map((airdrop) => (
          <Card key={airdrop.id} className={`bg-crypto-darkGray border-white/10 transition-all duration-300 hover:border-crypto-orange/50 ${!airdrop.isActive ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
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
              <p className="text-white/80 mb-4">{airdrop.description}</p>
              <div className="flex flex-col gap-2">
                <a 
                  href={airdrop.twitterLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-crypto-orange flex items-center gap-2 text-sm"
                >
                  <Twitter className="h-4 w-4" />
                  <span>رابط تويتر</span>
                </a>
                {airdrop.youtubeLink && (
                  <a 
                    href={airdrop.youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-crypto-orange flex items-center gap-2 text-sm"
                  >
                    <Youtube className="h-4 w-4" />
                    <span>فيديو توضيحي</span>
                  </a>
                )}
              </div>
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
        ))}
      </div>
    </div>
  );
};

export default AirdropListSection;
