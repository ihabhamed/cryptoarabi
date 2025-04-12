import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Twitter } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useAddAirdrop } from '@/lib/supabase-hooks';
import { Airdrop } from '@/types/supabase';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, { message: "يجب أن يكون اسم الإيردروب 3 أحرف على الأقل" }),
  description: z.string().optional(),
  twitter_link: z.string().url({ message: "يرجى إدخال رابط تويتر صحيح" }),
  youtube_link: z.string().url({ message: "يرجى إدخال رابط يوتيوب صحيح" }).optional().or(z.literal('')),
  end_date: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AirdropFormSection = () => {
  const { toast } = useToast();
  const addAirdrop = useAddAirdrop();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      twitter_link: "",
      youtube_link: "",
    },
  });

  function onSubmit(data: FormValues) {
    const currentDate = new Date();
    
    // Add start_date and set status
    const airdropData: Partial<Airdrop> = {
      ...data,
      start_date: currentDate.toISOString(),
      status: 'active',
    };
    
    addAirdrop.mutate(airdropData, {
      onSuccess: () => {
        toast({
          title: "تم تقديم الإيردروب",
          description: "تم تقديم التفاصيل الخاصة بالإيردروب بنجاح!",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "حدث خطأ",
          description: `لم يتم تقديم الإيردروب: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="bg-crypto-darkGray border-white/10 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-white text-2xl">شرح الإيردروب</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <Button 
              type="submit" 
              className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white mt-4"
              disabled={addAirdrop.isPending}
            >
              {addAirdrop.isPending ? "جاري التقديم..." : "تقديم الإيردروب"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AirdropFormSection;
