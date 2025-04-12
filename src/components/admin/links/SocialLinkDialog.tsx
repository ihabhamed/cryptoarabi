
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SocialLink } from '@/lib/hooks/useSocialLinks';

interface SocialLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editLink: SocialLink | null;
  newLink: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isPending: boolean;
}

const SocialLinkDialog: React.FC<SocialLinkDialogProps> = ({
  isOpen,
  onOpenChange,
  editLink,
  newLink,
  onInputChange,
  onSubmit,
  isPending
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-crypto-darkGray border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-crypto-orange">{editLink ? 'تعديل رابط التواصل الاجتماعي' : 'إضافة رابط تواصل اجتماعي جديد'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editLink 
              ? 'قم بتعديل معلومات رابط التواصل الاجتماعي' 
              : 'قم بإدخال معلومات رابط التواصل الاجتماعي الجديد'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-white">المنصة</Label>
            <Input 
              id="platform" 
              name="platform"
              value={editLink ? editLink.platform : newLink.platform} 
              onChange={onInputChange}
              placeholder="Twitter, Facebook, Instagram..." 
              className="bg-crypto-darkBlue border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white">رابط URL</Label>
            <Input 
              id="url" 
              name="url"
              value={editLink ? editLink.url : newLink.url} 
              onChange={onInputChange}
              placeholder="https://twitter.com/username" 
              className="bg-crypto-darkBlue border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-white">رمز SVG للأيقونة</Label>
            <textarea 
              id="icon" 
              name="icon"
              value={editLink ? editLink.icon : newLink.icon} 
              onChange={onInputChange}
              placeholder='<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>' 
              rows={5}
              className="flex h-20 min-h-[80px] w-full rounded-md border border-white/20 bg-crypto-darkBlue px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            إلغاء
          </Button>
          <Button 
            type="button"
            className="bg-crypto-orange hover:bg-crypto-orange/90 text-white"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending 
              ? 'جاري الحفظ...' 
              : editLink ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinkDialog;
