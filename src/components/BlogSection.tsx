
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "كيف تبدأ في تداول العملات المشفرة للمبتدئين",
      excerpt: "دليل شامل لكل من يرغب في دخول عالم العملات المشفرة، من اختيار المنصة المناسبة إلى استراتيجيات التداول الأساسية.",
      image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "١٢ أبريل ٢٠٢٥",
      category: "تداول",
      slug: "crypto-investment-basics"
    },
    {
      id: 2,
      title: "مستقبل تقنية البلوكتشين في القطاع المالي العربي",
      excerpt: "تحليل معمق لتأثير تقنية البلوكتشين على القطاع المالي في العالم العربي والفرص المتاحة للمؤسسات المالية.",
      image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "٨ أبريل ٢٠٢٥",
      category: "تكنولوجيا",
      slug: "blockchain-impact-arabic-finance"
    },
    {
      id: 3,
      title: "الـ NFTs ودورها في دعم الفنانين العرب",
      excerpt: "استكشاف كيف يمكن للفنانين العرب الاستفادة من تقنية الرموز غير القابلة للاستبدال (NFTs) لتسويق أعمالهم الفنية.",
      image: "https://images.unsplash.com/photo-1646634685252-8db8a56f08b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "١ أبريل ٢٠٢٥",
      category: "فن",
      slug: "nft-investment-guide"
    }
  ];

  return (
    <section id="blog" className="section-padding bg-crypto-darkGray relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-crypto-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-crypto-lightBlue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">آخر المقالات</h2>
            <p className="text-gray-300 max-w-2xl">
              استكشف أحدث المقالات والتحليلات في عالم العملات المشفرة والبلوكتشين
            </p>
          </div>
          <Link to="/blog">
            <Button className="mt-4 md:mt-0 bg-transparent hover:bg-crypto-darkBlue text-crypto-orange hover:text-crypto-orange border border-crypto-orange hover:border-crypto-orange">
              جميع المقالات
              <ArrowLeft className="mr-2 h-4 w-4 rtl-flip" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="crypto-card hover:translate-y-[-8px]">
              <div className="relative mb-4 overflow-hidden rounded-lg aspect-video">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-crypto-orange text-white text-xs font-medium py-1 px-2 rounded">
                  {post.category}
                </div>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm mb-3">
                <Calendar className="h-4 w-4 ml-1" />
                <span>{post.date}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 hover:text-crypto-orange transition-colors">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              
              <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
              
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-crypto-orange hover:text-crypto-orange/80 font-medium">
                اقرأ المزيد
                <ArrowLeft className="mr-1 h-4 w-4 rtl-flip" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
