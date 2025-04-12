import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useBlogPosts } from '@/lib/hooks';
import { BlogPost } from '@/types/supabase';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogPosts = [], isLoading, error } = useBlogPosts();
  
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  
  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (isLoading) {
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

            {/* Loading Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="crypto-card bg-crypto-darkGray border border-white/10 animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-6 bg-gray-700 rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-700 rounded w-1/3"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.error('Error loading blog posts:', error);
    return (
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-custom mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">حدث خطأ</h1>
            <p className="text-gray-300 mb-6">حدث خطأ أثناء تحميل المقالات. يرجى المحاولة مرة أخرى لاحقًا.</p>
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
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">المقالات</h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              اكتشف أحدث المقالات والتحليلات في عالم العملات المشفرة والبلوكتشين، من تحليلات السوق إلى الدروس التعليمية والنصائح الاستثمارية.
            </p>
          </div>

          {/* Blog Post Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <Card key={post.id} className="crypto-card hover:translate-y-[-8px] bg-crypto-darkGray border border-white/10">
                  <CardHeader>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Calendar className="h-4 w-4 ml-1" />
                      <span>{new Date(post.publish_date).toLocaleDateString('ar-SA')}</span>
                      <span className="mr-3 bg-crypto-orange text-white text-xs font-medium py-1 px-2 rounded">
                        {post.category || "عام"}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold hover:text-crypto-orange transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 line-clamp-3">{post.excerpt || post.content?.substring(0, 150)}</p>
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
              ))
            ) : (
              <div className="col-span-full text-center text-white">
                <p>لا توجد مقالات متاحة حاليًا.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="bg-crypto-darkGray rounded-xl p-4 border border-white/10 flex items-center shadow-lg">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(Math.max(1, currentPage - 1));
                        }}
                        className="font-medium bg-crypto-darkBlue hover:bg-crypto-orange/20 border border-crypto-orange/30 text-crypto-orange hover:text-white transition-colors duration-300 flex flex-row-reverse"
                      >
                        <span>السابق</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </PaginationPrevious>
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          href="#" 
                          isActive={currentPage === index + 1} 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          className={`font-medium transition-colors duration-300 ${
                            currentPage === index + 1 
                              ? 'bg-crypto-orange text-white border-crypto-orange' 
                              : 'bg-transparent text-white hover:bg-crypto-orange/20 border border-crypto-orange/30'
                          }`}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(Math.min(totalPages, currentPage + 1));
                        }}
                        className="font-medium bg-crypto-darkBlue hover:bg-crypto-orange/20 border border-crypto-orange/30 text-crypto-orange hover:text-white transition-colors duration-300"
                      >
                        <span>التالي</span>
                        <ArrowLeft className="h-4 w-4 mr-2 rtl-flip" />
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
