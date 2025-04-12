
import { useState } from 'react';
import { toast } from "@/lib/utils/toast-utils";
import { getAirdropLink } from '@/lib/utils/airdropFormUtils';

export function useAirdropLink() {
  const [linkCopied, setLinkCopied] = useState(false);
  
  const copyAirdropLink = (idOrEvent?: string | React.MouseEvent<HTMLButtonElement>) => {
    // Handle if the parameter is a React MouseEvent (when used directly as onClick handler)
    if (idOrEvent && typeof idOrEvent !== 'string') {
      // If used as a button click handler without parameters, we need to access id through other means
      // In this case, we assume the id is already available in the context where the function is called
      return;
    }
    
    // Handle direct ID string
    const id = typeof idOrEvent === 'string' ? idOrEvent : undefined;
    
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
