
import React from 'react';
import { CalendarIcon, Twitter } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useFormContext } from "react-hook-form";
import { AirdropFormValues } from "@/lib/validations/airdropSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const AirdropFormFields: React.FC = () => {
  const form = useFormContext<AirdropFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">اسم الإيردروب</FormLabel>
            <FormControl>
              <Input placeholder="أدخل اسم الإيردروب" {...field} className="bg-background/5 border-white/10 text-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">وصف الإيردروب (اختياري)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="أدخل وصفاً للإيردروب" 
                {...field} 
                className="bg-background/5 border-white/10 text-white min-h-[80px]" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="twitter_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">رابط تويتر</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="أدخل رابط تويتر المشروع" 
                  {...field} 
                  className="pl-10 bg-background/5 border-white/10 text-white" 
                />
                <Twitter className="absolute right-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="youtube_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">رابط يوتيوب (اختياري)</FormLabel>
            <FormControl>
              <Input 
                placeholder="أدخل رابط فيديو يوتيوب" 
                {...field} 
                className="bg-background/5 border-white/10 text-white" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-white">تاريخ انتهاء الإيردروب (اختياري)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center bg-background/5 border-white/10 text-white hover:bg-background/10"
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: ar })
                    ) : (
                      <span>اختر تاريخاً</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  locale={ar}
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  className="rounded-md border pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AirdropFormFields;
