
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, Airdrop } from "@/types/supabase";

interface ContentWithHashtags extends BlogPost {
  hashtags: string;
}

interface AirdropWithHashtags extends Airdrop {
  hashtags: string;
}

export function useHashtagContent(hashtag: string | undefined) {
  // Function to fetch blog posts by hashtag
  const fetchBlogsByHashtag = async (): Promise<ContentWithHashtags[]> => {
    if (!hashtag) return [];
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .ilike('hashtags', `%${hashtag}%`)
      .order('publish_date', { ascending: false });
    
    if (error) throw error;
    return data as ContentWithHashtags[] || [];
  };
  
  // Function to fetch airdrops by hashtag
  const fetchAirdropsByHashtag = async (): Promise<AirdropWithHashtags[]> => {
    if (!hashtag) return [];
    
    const { data, error } = await supabase
      .from('airdrops')
      .select('*')
      .ilike('hashtags', `%${hashtag}%`)
      .order('publish_date', { ascending: false });
    
    if (error) throw error;
    return data as AirdropWithHashtags[] || [];
  };
  
  // Use React Query to fetch both blogs and airdrops
  const blogsQuery = useQuery({
    queryKey: ['blogs_by_hashtag', hashtag],
    queryFn: fetchBlogsByHashtag,
    enabled: !!hashtag,
  });
  
  const airdropsQuery = useQuery({
    queryKey: ['airdrops_by_hashtag', hashtag],
    queryFn: fetchAirdropsByHashtag,
    enabled: !!hashtag,
  });
  
  return {
    blogPosts: blogsQuery.data || [],
    airdrops: airdropsQuery.data || [],
    isLoading: blogsQuery.isLoading || airdropsQuery.isLoading,
    isError: blogsQuery.isError || airdropsQuery.isError,
  };
}
