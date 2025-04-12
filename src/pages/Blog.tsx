
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const blogPosts = [
    {
      id: 1,
      title: "أساسيات الاستثمار في العملات المشفرة للمبتدئين",
      excerpt: "دليل شامل لكل من يرغب في دخول عالم العملات المشفرة، من اختيار المنصة المناسبة إلى استراتيجيات التداول الأساسية.",
      date: "١٢ أبريل ٢٠٢٥",
      category: "أساسيات",
      slug: "crypto-investment-basics"
    },
    {
      id: 2,
      title: "كيف تؤثر تقنية البلوكتشين على القطاع المالي في العالم العربي؟",
      excerpt: "تحليل معمق لتأثير تقنية البلوكتشين على القطاع المالي في العالم العربي والفرص المتاحة للمؤسسات المالية.",
      date: "٨ أبريل ٢٠٢٥",
      category: "تكنولوجيا",
      slug: "blockchain-impact-arabic-finance"
    },
    {
      id: 3,
      title: "دليلك الشامل للـ NFTs وكيفية الاستثمار فيها",
      excerpt: "كل ما تحتاج معرفته عن الرموز غير القابلة للاستبدال (NFTs) وكيفية شرائها وبيعها والاستثمار فيها بنجاح.",
      date: "١ أبريل ٢٠٢٥",
      category: "استثمار",
      slug: "nft-investment-guide"
    },
    {
      id: 4,
      title: "أفضل محافظ العملات المشفرة لعام ٢٠٢٥",
      excerpt: "مراجعة شاملة لأفضل محافظ العملات المشفرة من حيث الأمان وسهولة الاستخدام والميزات المتقدمة.",
      date: "٢٥ مارس ٢٠٢٥",
      category: "أدوات",
      slug: "best-crypto-wallets-2025"
    },
    {
      id: 5,
      title: "كيف تتجنب عمليات الاحتيال في سوق العملات المشفرة؟",
      excerpt: "نصائح وإرشادات عملية لحماية استثماراتك من عمليات الاحتيال والمشاريع الوهمية في سوق العملات المشفرة.",
      date: "١٨ مارس ٢٠٢٥",
      category: "أمان",
      slug: "avoid-crypto-scams"
    },
    {
      id: 6,
      title: "مستقبل التمويل اللامركزي (DeFi) في المنطقة العربية",
      excerpt: "نظرة مستقبلية على تطور التمويل اللامركزي وتأثيره على القطاع المالي في المنطقة العربية خلال السنوات القادمة.",
      date: "١٠ مارس ٢٠٢٥",
      category: "تحليلات",
      slug: "defi-future-arabic-region"
    },
  ];

  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">المقالات</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              اكتشف أحدث المقالات والتحليلات في عالم العملات المشفرة والبلوكتشين، من تحليلات السوق إلى الدروس التعليمية والنصائح الاستثمارية.
            </p>
          </div>

          {/* Blog Post Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="crypto-card hover:translate-y-[-8px] bg-crypto-darkGray border border-white/10">
                <CardHeader>
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <Calendar className="h-4 w-4 ml-1" />
                    <span>{post.date}</span>
                    <span className="mr-3 bg-crypto-orange text-white text-xs font-medium py-1 px-2 rounded">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold hover:text-crypto-orange transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Link to={`/blog/${post.slug}`}>
                    <Button className="text-crypto-orange hover:text-crypto-orange/80 bg-transparent hover:bg-crypto-darkBlue border border-crypto-orange hover:border-crypto-orange/80">
                      قراءة المزيد
                      <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination - Updated with Arabic labels */}
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                    السابق
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive={currentPage === 2} onClick={() => setCurrentPage(2)}>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}>
                    التالي
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
