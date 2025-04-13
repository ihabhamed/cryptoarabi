
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBlogPosts } from '@/lib/hooks';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogLoadingSkeleton from '@/components/blog/BlogLoadingSkeleton';
import BlogErrorState from '@/components/blog/BlogErrorState';
import BlogPostsList from '@/components/blog/BlogPostsList';
import BlogPagination from '@/components/blog/BlogPagination';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: blogPosts = [], isLoading, error } = useBlogPosts();
  
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  
  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Log data to help debug image issues
  useEffect(() => {
    if (blogPosts.length > 0) {
      console.log('Blog posts loaded:', blogPosts.length);
      blogPosts.forEach(post => {
        console.log(`Post: ${post.title}, Image URL: ${post.image_url}`);
      });
    }
  }, [blogPosts]);

  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          <BlogHeader />

          {isLoading ? (
            <BlogLoadingSkeleton />
          ) : error ? (
            <BlogErrorState />
          ) : (
            <>
              <BlogPostsList posts={currentPosts} />
              <BlogPagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
