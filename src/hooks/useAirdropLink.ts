
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAirdropLink } from '@/lib/utils/airdropFormUtils';

export function useAirdropLink() {
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();
  
  const copyAirdropLink = (id?: string) => {
    if (id) {
      const link = getAirdropLink(id);
      navigator.clipboard.writeText(link).then(() => {
        setLinkCopied(true);
        toast({
          title: "تم النسخ",
          description: "تم نسخ الرابط بنجاح",
        });
        setTimeout(() => setLinkCopied(false), 2000);
      });
    } else {
      toast({
        variant: "destructive",
        title: "غير متاح",
        description: "يجب حفظ الإيردروب أولاً قبل نسخ الرابط",
      });
    }
  };
  
  return {
    linkCopied,
    copyAirdropLink
  };
}
