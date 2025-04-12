
import React from 'react';
import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BlogPostTagsProps {
  hashtags: string | null;
}

export const BlogPostTags: React.FC<BlogPostTagsProps> = ({ hashtags }) => {
  if (!hashtags) return null;
  
  const tagsList = hashtags.split(',').map(tag => tag.trim()).filter(Boolean);
  
  if (tagsList.length === 0) return null;
  
  return (
    <div className="mt-8 mb-8">
      <Separator className="mb-6 bg-white/10" />
      
      <div className="flex items-center mb-3">
        <Hash className="h-5 w-5 text-crypto-orange mr-2" />
        <h3 className="text-lg font-medium text-white">الوسوم</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tagsList.map((tag, index) => (
          <Link to={`/hashtag/${tag}`} key={index}>
            <Badge 
              className="bg-crypto-darkBlue border border-crypto-orange/30 hover:bg-crypto-orange/10 
                       text-white px-3 py-1 text-sm cursor-pointer transition-colors"
            >
              #{tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};
