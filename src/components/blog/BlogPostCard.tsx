
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { BlogPost } from '@/types/supabase';
import { Badge } from "@/components/ui/badge";
import { isValidImageUrl } from '@/hooks/blog/utils/image/imageValidation';
import { getFallbackImageUrl, handleImageError } from '@/hooks/blog/utils/image/imageFallback';
import { normalizeImageUrl } from '@/hooks/blog/utils/image/imageProcessing';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  // State to track image loading errors
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  // Extract hashtags if present
  const hashtags = post.hashtags 
    ? post.hashtags.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 3) 
    : [];

  // Set the image URL when the component mounts or when post changes
  useEffect(() => {
    console.log(`[BlogPostCard] Initializing for post: ${post.title} (ID: ${post.id})`);
    console.log(`[BlogPostCard] Raw image URL from DB: "${post.image_url || 'NULL'}"`);
    
    // Check if image_url exists and is valid
    if (isValidImageUrl(post.image_url)) {
      // Try to normalize the URL if needed
      const normalizedUrl = normalizeImageUrl(post.image_url);
      console.log(`[BlogPostCard] Using normalized post image: ${normalizedUrl} for post: ${post.title}`);
      setImageUrl(normalizedUrl);
    } else {
      // Use fallback image if no valid image exists
      console.log(`[BlogPostCard] No valid image found for post: ${post.title}, using fallback`);
      setImageUrl(getFallbackImageUrl());
      setImageError(true);
    }
  }, [post.id, post.title, post.image_url]);

  const handleImageLoadError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`[BlogPostCard] Image load error for post: ${post.title}, URL: ${imageUrl}`);
    setImageError(true);
    setImageUrl(getFallbackImageUrl());
  };

  return (
    <div className="bg-crypto-darkGray/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-crypto-orange/30 h-full flex flex-col">
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden h-48 relative">
        <img 
          src={imageUrl || getFallbackImageUrl()} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={handleImageLoadError}
        />
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-3">
            <span className="text-xs text-gray-300 px-2 py-1 bg-black/50 rounded-full">الصورة غير متاحة</span>
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-gray-400 text-xs mb-2">
          <Calendar className="h-3 w-3 ml-1" />
          <span>{new Date(post.publish_date).toLocaleDateString('ar-SA')}</span>
          
          {post.category && (
            <span className="mr-3 bg-crypto-orange text-white text-xs py-0.5 px-2 rounded-sm">
              {post.category}
            </span>
          )}
        </div>
        
        <Link to={`/blog/${post.slug}`} className="mb-3 block">
          <h3 className="text-xl font-bold text-white hover:text-crypto-orange transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
        </p>
        
        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hashtags.map((tag, index) => (
              <Link to={`/hashtag/${tag}`} key={index}>
                <Badge variant="outline" className="text-xs text-gray-300 border-crypto-orange/20 hover:bg-crypto-orange/10">
                  #{tag}
                </Badge>
              </Link>
            ))}
            {post.hashtags && post.hashtags.split(',').length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-400">
                +{post.hashtags.split(',').length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <Link 
          to={`/blog/${post.slug}`} 
          className="text-crypto-orange inline-flex items-center mt-auto hover:text-crypto-orange/80 transition-colors text-sm"
        >
          اقرأ المزيد 
          <ArrowLeft className="h-4 w-4 mr-1 rtl-flip" />
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
