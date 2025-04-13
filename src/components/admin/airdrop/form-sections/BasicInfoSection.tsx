
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewAirdrop } from '@/types/airdrop';

interface BasicInfoSectionProps {
  formData: NewAirdrop & { meta_title?: string; meta_description?: string; hashtags?: string; steps?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  handleChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white mb-2">العنوان</label>
        <Input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="أدخل عنوان الإيردروب"
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-white mb-2">الوصف</label>
        <Textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="أدخل وصف الإيردروب"
          className="bg-crypto-darkBlue/50 border-white/20 text-white min-h-[120px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">تاريخ البداية</label>
          <Input
            type="datetime-local"
            name="start_date"
            value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
            className="bg-crypto-darkBlue/50 border-white/20 text-white"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">تاريخ النهاية</label>
          <Input
            type="datetime-local"
            name="end_date"
            value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
            className="bg-crypto-darkBlue/50 border-white/20 text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-white mb-2">الحالة</label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger className="bg-crypto-darkBlue/50 border-white/20 text-white">
            <SelectValue placeholder="اختر الحالة" />
          </SelectTrigger>
          <SelectContent className="bg-crypto-darkBlue border-white/20 text-white">
            <SelectItem value="upcoming">قادم</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="expired">منتهي</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-white mb-2">رابط تويتر</label>
        <Input
          name="twitter_link"
          value={formData.twitter_link || ''}
          onChange={handleChange}
          placeholder="أدخل رابط تويتر (اختياري)"
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
        />
      </div>
      
      <div>
        <label className="block text-white mb-2">رابط يوتيوب</label>
        <Input
          name="youtube_link"
          value={formData.youtube_link || ''}
          onChange={handleChange}
          placeholder="أدخل رابط فيديو يوتيوب (اختياري)"
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
        />
      </div>
      
      <div>
        <label className="block text-white mb-2">رابط الحصول</label>
        <Input
          name="claim_url"
          value={formData.claim_url || ''}
          onChange={handleChange}
          placeholder="أدخل رابط الحصول على الإيردروب (اختياري)"
          className="bg-crypto-darkBlue/50 border-white/20 text-white"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
