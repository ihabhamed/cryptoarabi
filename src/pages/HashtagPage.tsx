
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useHashtagContent } from '@/hooks/useHashtagContent';

const HashtagPage = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const { blogPosts, airdrops, isLoading } = useHashtagContent(hashtag);
  
  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="container-custom mx-auto pt-28 pb-16">
        <div className="flex items-center mb-8 space-x-2">
          <Tag className="h-6 w-6 text-crypto-orange" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">#{hashtag}</h1>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-96 grid-cols-3 bg-crypto-darkGray/50">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="blogs">المدونة</TabsTrigger>
            <TabsTrigger value="airdrops">الإيردروبات</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-orange"></div>
            </div>
          ) : (
            <>
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {blogPosts.map(post => (
                    <BlogCard key={`blog-${post.id}`} post={post} />
                  ))}
                  {airdrops.map(airdrop => (
                    <AirdropCard key={`airdrop-${airdrop.id}`} airdrop={airdrop} />
                  ))}
                  {blogPosts.length === 0 && airdrops.length === 0 && (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-lg text-gray-400">لا توجد محتويات مرتبطة بهذا الهاشتاج</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="blogs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {blogPosts.map(post => (
                    <BlogCard key={`blog-tab-${post.id}`} post={post} />
                  ))}
                  {blogPosts.length === 0 && (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-lg text-gray-400">لا توجد مقالات مرتبطة بهذا الهاشتاج</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="airdrops">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {airdrops.map(airdrop => (
                    <AirdropCard key={`airdrop-tab-${airdrop.id}`} airdrop={airdrop} />
                  ))}
                  {airdrops.length === 0 && (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-lg text-gray-400">لا توجد إيردروبات مرتبطة بهذا الهاشتاج</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

const BlogCard = ({ post }: { post: any }) => {
  return (
    <Card className="bg-crypto-darkGray/80 border-white/10 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-crypto-orange/10">
      <CardContent className="p-0">
        <div className="h-48 overflow-hidden">
          <img 
            src={post.image_url || "/placeholder.svg"} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              <CalendarIcon className="inline-block mr-1 h-4 w-4" />
              {post.publish_date ? new Date(post.publish_date).toLocaleDateString('ar-SA') : ''}
            </span>
            <span className="text-xs text-crypto-orange">{post.category}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="block">
            <h3 className="text-lg font-bold text-white mb-2 hover:text-crypto-orange line-clamp-2">{post.title}</h3>
          </Link>
          <p className="text-sm text-gray-300 mb-3 line-clamp-3">{post.excerpt}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags && post.hashtags.split(',').map((tag: string, index: number) => (
              <Link 
                key={`tag-${index}`} 
                to={`/hashtag/${tag.trim()}`}
                className="inline-block text-xs bg-crypto-darkBlue/50 hover:bg-crypto-orange/20 text-crypto-orange px-2 py-1 rounded-md"
              >
                #{tag.trim()}
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AirdropCard = ({ airdrop }: { airdrop: any }) => {
  return (
    <Card className="bg-crypto-darkGray/80 border-white/10 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-crypto-orange/10">
      <CardContent className="p-0">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={airdrop.image_url || "/placeholder.svg"} 
            alt={airdrop.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-1 rounded ${
              airdrop.status === 'active' 
                ? 'bg-green-500/90' 
                : airdrop.status === 'upcoming' 
                ? 'bg-yellow-500/90' 
                : 'bg-red-500/90'
            }`}>
              {airdrop.status === 'active' 
                ? 'نشط' 
                : airdrop.status === 'upcoming' 
                ? 'قادم' 
                : 'منتهي'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {airdrop.end_date ? 
                formatDistanceToNow(new Date(airdrop.end_date), { locale: ar, addSuffix: true }) :
                'غير محدد'
              }
            </span>
          </div>
          <Link to={`/airdrop/${airdrop.id}`} className="block">
            <h3 className="text-lg font-bold text-white mb-2 hover:text-crypto-orange line-clamp-2">{airdrop.title}</h3>
          </Link>
          <p className="text-sm text-gray-300 mb-3 line-clamp-3">{airdrop.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {airdrop.hashtags && airdrop.hashtags.split(',').map((tag: string, index: number) => (
              <Link 
                key={`tag-${index}`} 
                to={`/hashtag/${tag.trim()}`}
                className="inline-block text-xs bg-crypto-darkBlue/50 hover:bg-crypto-orange/20 text-crypto-orange px-2 py-1 rounded-md"
              >
                #{tag.trim()}
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HashtagPage;
