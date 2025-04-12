
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar, ChevronLeft, Twitter, Youtube, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAirdrop } from '@/lib/supabase-hooks';
import { Card, CardContent } from "@/components/ui/card";

const AirdropDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: airdrop, isLoading, error } = useAirdrop(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-custom mx-auto">
            <div className="mb-8">
              <Link to="/airdrop" className="text-gray-400 hover:text-crypto-orange transition-colors inline-flex items-center">
                <ChevronLeft className="ml-1 h-4 w-4 rtl-flip" />
                العودة إلى الإيردروبات
              </Link>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="h-80 bg-gray-700 rounded w-full mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !airdrop) {
    console.error('Error loading airdrop:', error);
    return (
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-custom mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">الإيردروب غير موجود</h1>
            <Link to="/airdrop">
              <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white">
                <ChevronLeft className="ml-2 h-4 w-4 rtl-flip" />
                العودة إلى الإيردروبات
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Link to="/airdrop" className="text-gray-400 hover:text-crypto-orange transition-colors inline-flex items-center">
              <ChevronLeft className="ml-1 h-4 w-4 rtl-flip" />
              العودة إلى الإيردروبات
            </Link>
          </div>

          {/* Airdrop Header */}
          <div className="mb-8">
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <Calendar className="h-4 w-4 ml-1" />
              <span>
                {airdrop.start_date && new Date(airdrop.start_date).toLocaleDateString('ar-SA')}
                {airdrop.end_date && ` - ${new Date(airdrop.end_date).toLocaleDateString('ar-SA')}`}
              </span>
              {airdrop.status === 'active' ? (
                <Badge className="mr-3 bg-green-600 hover:bg-green-700">نشط</Badge>
              ) : (
                <Badge className="mr-3 bg-gray-600 hover:bg-gray-700">منتهي</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">{airdrop.title}</h1>
          </div>

          {/* Featured Image - if available */}
          {airdrop.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={airdrop.image_url} 
                alt={airdrop.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Airdrop Content */}
          <Card className="bg-crypto-darkGray border-white/10 mb-8">
            <CardContent className="pt-6 pb-6">
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>{airdrop.description}</p>

                <div className="flex flex-col gap-4 mt-6">
                  {airdrop.twitter_link && (
                    <a 
                      href={airdrop.twitter_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-crypto-orange flex items-center gap-2"
                    >
                      <Twitter className="h-5 w-5" />
                      <span>حساب تويتر المشروع</span>
                      <ExternalLink className="h-4 w-4 mr-auto" />
                    </a>
                  )}
                  
                  {airdrop.youtube_link && (
                    <a 
                      href={airdrop.youtube_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-crypto-orange flex items-center gap-2"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>الفيديو التوضيحي</span>
                      <ExternalLink className="h-4 w-4 mr-auto" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claim Button */}
          {airdrop.status === 'active' && (
            <div className="text-center mt-8">
              {airdrop.claim_url ? (
                <a href={airdrop.claim_url} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-crypto-orange hover:bg-crypto-orange/80 text-white px-8 py-6 text-lg">
                    المطالبة بالإيردروب
                  </Button>
                </a>
              ) : (
                <Button size="lg" className="bg-crypto-orange hover:bg-crypto-orange/80 text-white px-8 py-6 text-lg">
                  المطالبة بالإيردروب
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AirdropDetail;
