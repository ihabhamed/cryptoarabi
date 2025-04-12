
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/supabase';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
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
  );
};

export default BlogPostCard;
