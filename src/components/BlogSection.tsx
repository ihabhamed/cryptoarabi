
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBlogPosts } from '@/lib/hooks';
import { BlogPost } from '@/types/supabase';

const BlogSection = () => {
  const { data: blogPosts = [], isLoading, error } = useBlogPosts();
  // Track image loading errors for each post by ID
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  // Track image URLs for each post 
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  
  // Show only 3 latest blog posts for homepage
  const latestPosts = blogPosts.slice(0, 3);
  
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

  // Debug logging of all blog posts at load time
  useEffect(() => {
    if (blogPosts.length > 0) {
      console.log('[BlogSection] All blog posts loaded:');
      blogPosts.forEach(post => {
        console.log(`[BlogSection] Post: ${post.title}, ID: ${post.id}, Image URL: "${post.image_url || 'NULL'}"`);
      });
    }
  }, [blogPosts]);

  // Determine image URLs for all posts when they load
  useEffect(() => {
    if (latestPosts.length > 0) {
      console.log(`[BlogSection] Processing ${latestPosts.length} latest posts for display`);
      const newImageUrls: Record<string, string> = {};
      
      latestPosts.forEach(post => {
        console.log(`[BlogSection] Processing image for post: ${post.title} (ID: ${post.id})`);
        
        // If we already know this image errors, use fallback
        if (imageErrors[post.id]) {
          console.log(`[BlogSection] Using fallback due to previous error for post: ${post.id}`);
          newImageUrls[post.id] = FALLBACK_IMAGE;
          return;
        }
        
        // Check if image_url exists and is valid
        if (post.image_url && 
            post.image_url !== 'null' && 
            post.image_url !== 'undefined' && 
            post.image_url.trim() !== '') {
          console.log(`[BlogSection] Using post image: ${post.image_url} for post: ${post.title}`);
          newImageUrls[post.id] = post.image_url;
        } else {
          // Use fallback image if no valid image exists
          console.log(`[BlogSection] No valid image found for post: ${post.title}, using fallback`);
          newImageUrls[post.id] = FALLBACK_IMAGE;
        }
      });
      
      setImageUrls(newImageUrls);
    }
  }, [latestPosts, imageErrors]);

  // Handle image loading errors
  const handleImageError = (postId: string) => {
    console.error(`[BlogSection] Image loading error for post ID: ${postId}`);
    setImageErrors(prev => ({
      ...prev,
      [postId]: true
    }));
    
    // This will trigger the useEffect to update the image URL to the fallback
    setImageUrls(prev => ({
      ...prev,
      [postId]: FALLBACK_IMAGE
    }));
  };

  // Force image reload if URL is already the fallback
  const forceImageReload = (url: string) => {
    if (url === FALLBACK_IMAGE) {
      return `${url}?t=${new Date().getTime()}`;
    }
    return url;
  };

  if (isLoading) {
    return (
      <section id="blog" className="section-padding bg-crypto-darkGray relative">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <article key={i} className="crypto-card animate-pulse">
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-video bg-gray-700"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
                <div className="h-6 bg-gray-700 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('[BlogSection] Error loading blog posts:', error);
    return (
      <section id="blog" className="section-padding bg-crypto-darkGray relative">
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">آخر المقالات</h2>
            </div>
          </div>
          <p className="text-center text-red-500">حدث خطأ أثناء تحميل المقالات. يرجى المحاولة مرة أخرى لاحقًا.</p>
        </div>
      </section>
    );
  }

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
          {latestPosts.length > 0 ? (
            latestPosts.map((post: BlogPost) => (
              <article key={post.id} className="crypto-card hover:translate-y-[-8px]">
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-video">
                  {imageUrls[post.id] && (
                    <img 
                      src={forceImageReload(imageUrls[post.id])} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={() => handleImageError(post.id)}
                    />
                  )}
                  <div className="absolute top-3 right-3 bg-crypto-orange text-white text-xs font-medium py-1 px-2 rounded">
                    {post.category || "عام"}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>{post.publish_date ? new Date(post.publish_date).toLocaleDateString('ar-SA') : "بدون تاريخ"}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 hover:text-crypto-orange transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                
                <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt || post.content?.substring(0, 150)}</p>
                
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-crypto-orange hover:text-crypto-orange/80 font-medium">
                  اقرأ المزيد
                  <ArrowLeft className="mr-1 h-4 w-4 rtl-flip" />
                </Link>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-white/70">لا توجد مقالات متاحة حاليًا.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
