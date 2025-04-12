
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FooterLink } from '@/lib/hooks/useFooterLinks';

interface FooterLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editLink: FooterLink | null;
  newLink: Omit<FooterLink, 'id' | 'created_at' | 'updated_at'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

const FooterLinkDialog: React.FC<FooterLinkDialogProps> = ({
  isOpen,
  onOpenChange,
  editLink,
  newLink,
  onInputChange,
  onCategoryChange,
  onSubmit,
  isPending
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-crypto-darkGray border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-crypto-orange">{editLink ? 'تعديل الرابط' : 'إضافة رابط جديد'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {editLink 
              ? 'قم بتعديل معلومات الرابط' 
              : 'قم بإدخال معلومات الرابط الجديد'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">عنوان الرابط</Label>
            <Input 
              id="title" 
              name="title"
              value={editLink ? editLink.title : newLink.title} 
              onChange={onInputChange}
              placeholder="الرئيسية" 
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
              placeholder="/home" 
              className="bg-crypto-darkBlue border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">التصنيف</Label>
            <Select 
              onValueChange={onCategoryChange}
              defaultValue={editLink ? editLink.category : newLink.category}
            >
              <SelectTrigger id="category" className="bg-crypto-darkBlue border-white/20 text-white">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent className="bg-crypto-darkBlue border-white/20 text-white">
                <SelectItem value="quick_links">روابط سريعة</SelectItem>
                <SelectItem value="services">خدمات</SelectItem>
                <SelectItem value="legal">قانوني</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order" className="text-white">ترتيب العرض</Label>
            <Input 
              id="sort_order" 
              name="sort_order"
              type="number"
              value={editLink ? editLink.sort_order : newLink.sort_order} 
              onChange={onInputChange}
              placeholder="1" 
              className="bg-crypto-darkBlue border-white/20 text-white"
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

export default FooterLinkDialog;
