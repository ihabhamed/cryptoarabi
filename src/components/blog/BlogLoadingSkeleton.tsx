
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const BlogLoadingSkeleton = () => {
  return (
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
  );
};

export default BlogLoadingSkeleton;
