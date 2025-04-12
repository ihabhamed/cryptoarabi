
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useBlogPost } from '@/lib/supabase-hooks';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-custom mx-auto">
            <div className="mb-8">
              <Link to="/blog" className="text-gray-400 hover:text-crypto-orange transition-colors inline-flex items-center">
                <ChevronLeft className="ml-1 h-4 w-4 rtl-flip" />
                العودة إلى المدونة
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

  if (error || !post) {
    console.error('Error loading blog post:', error);
    return (
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-custom mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">المقال غير موجود</h1>
            <Link to="/blog">
              <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white">
                <ChevronLeft className="ml-2 h-4 w-4 rtl-flip" />
                العودة إلى المدونة
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
            <Link to="/blog" className="text-gray-400 hover:text-crypto-orange transition-colors inline-flex items-center">
              <ChevronLeft className="ml-1 h-4 w-4 rtl-flip" />
              العودة إلى المدونة
            </Link>
          </div>

          {/* Blog Post Header */}
          <div className="mb-8">
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <Calendar className="h-4 w-4 ml-1" />
              <span>{new Date(post.publish_date).toLocaleDateString('ar-SA')}</span>
              <span className="mr-3 bg-crypto-orange text-white text-xs font-medium py-1 px-2 rounded">
                {post.category || "عام"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">{post.title}</h1>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.image_url || "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Blog Post Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-300 leading-relaxed space-y-4" />
          </article>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold mb-4">شارك المقال</h3>
            <div className="flex space-x-4 space-x-reverse">
              <Button className="bg-transparent hover:bg-crypto-darkBlue text-crypto-orange hover:text-crypto-orange border border-crypto-orange hover:border-crypto-orange">
                مشاركة على تويتر
              </Button>
              <Button className="bg-transparent hover:bg-crypto-darkBlue text-crypto-orange hover:text-crypto-orange border border-crypto-orange hover:border-crypto-orange">
                مشاركة على فيسبوك
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
