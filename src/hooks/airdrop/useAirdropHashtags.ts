
import { useState, useEffect, useCallback } from 'react';
import { NewAirdrop } from '@/types/airdrop';
import { toast } from "@/lib/utils/toast-utils";

interface UseAirdropHashtagsProps {
  hashtags?: string;
  title?: string;
  description?: string;
}

export function useAirdropHashtags(
  formData: UseAirdropHashtagsProps, 
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Initialize hashtags from formData only once or when hashtags string changes
  useEffect(() => {
    if (formData.hashtags && (!isInitialized || formData.hashtags !== hashtags.join(' '))) {
      const tagArray = formData.hashtags
        .split(/[\s,]+/) // Split by spaces or commas
        .map(tag => tag.trim())
        .filter(Boolean);
        
      setHashtags(tagArray);
      setIsInitialized(true);
    } else if (!formData.hashtags && hashtags.length > 0) {
      setHashtags([]);
    }
  }, [formData.hashtags, isInitialized, hashtags]);
  
  // Generate base suggestions only once or when title changes
  useEffect(() => {
    // Only run if we have title and no suggestions yet
    if (formData.title && !suggestedHashtags.length) {
      const baseSuggestions = [
        'crypto',
        'blockchain',
        'airdrop',
        'web3',
        'cryptocurrency',
        'defi',
        'tokens'
      ];
      
      // Only suggest hashtags that aren't already added
      const filteredSuggestions = baseSuggestions.filter(
        tag => !hashtags.includes(tag)
      );
      
      setSuggestedHashtags(filteredSuggestions.slice(0, 5));
    }
  }, [formData.title, hashtags, suggestedHashtags.length]);
  
  // Create a synthetic event to update parent component
  const updateParentFormData = useCallback((newHashtags: string[]) => {
    const event = {
      target: {
        name: 'hashtags',
        value: newHashtags.join(' ')
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(event);
  }, [handleChange]);
  
  // Add a hashtag
  const addHashtag = useCallback((newTag: string) => {
    // Skip if already exists
    if (hashtags.includes(newTag)) {
      toast({
        title: "موجود بالفعل",
        description: "هذا الهاشتاغ موجود بالفعل",
        variant: "destructive"
      });
      return;
    }
    
    const updatedHashtags = [...hashtags, newTag];
    setHashtags(updatedHashtags);
    updateParentFormData(updatedHashtags);
    
    // Remove from suggestions if present
    setSuggestedHashtags(prev => prev.filter(tag => tag !== newTag));
  }, [hashtags, updateParentFormData]);
  
  // Remove a hashtag
  const removeHashtag = useCallback((tagToRemove: string) => {
    if (!tagToRemove) return;
    
    const updatedHashtags = hashtags.filter(tag => tag !== tagToRemove);
    setHashtags(updatedHashtags);
    
    // Add a small delay to ensure state is stable before updating parent
    setTimeout(() => {
      updateParentFormData(updatedHashtags);
    }, 50);
  }, [hashtags, updateParentFormData]);
  
  // Add a suggested hashtag
  const addSuggestedHashtag = useCallback((tag: string) => {
    addHashtag(tag);
  }, [addHashtag]);
  
  return {
    hashtags,
    suggestedHashtags,
    addHashtag,
    removeHashtag,
    addSuggestedHashtag
  };
}
