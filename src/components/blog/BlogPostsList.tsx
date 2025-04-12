
import React from 'react';
import { BlogPost } from '@/types/supabase';
import BlogPostCard from './BlogPostCard';

interface BlogPostsListProps {
  posts: BlogPost[];
}

const BlogPostsList = ({ posts }: BlogPostsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.length > 0 ? (
        posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="col-span-full text-center text-white">
          <p>لا توجد مقالات متاحة حاليًا.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPostsList;
