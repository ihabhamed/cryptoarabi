
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Twitter, Youtube } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(5, { message: "العنوان يجب أن يكون على الأقل 5 أحرف" }),
  description: z.string().min(20, { message: "الوصف يجب أن يكون على الأقل 20 حرف" }),
  startDate: z.date({ required_error: "يرجى اختيار تاريخ البدء" }),
  endDate: z.date({ required_error: "يرجى اختيار تاريخ الانتهاء" }).optional(),
  twitterLink: z.string().url({ message: "يرجى إدخال رابط صحيح" }),
  youtubeLink: z.string().url({ message: "يرجى إدخال رابط صحيح" }).optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AirdropFormSection = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      twitterLink: "",
      youtubeLink: "",
      termsAccepted: false,
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    toast({
      title: "تم تقديم الإيردروب",
      description: "تم تقديم التفاصيل الخاصة بالإيردروب بنجاح!",
    });
    form.reset();
  }

  return (
    <Card className="bg-crypto-darkGray border-white/10 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-white text-2xl">إضافة إيردروب جديد</CardTitle>
        <CardDescription className="text-white/70">أدخل تفاصيل الإيردروب للمشاركة</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">عنوان الإيردروب</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الإيردروب" {...field} className="bg-background/5 border-white/10 text-white" />
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
                  <FormLabel className="text-white">وصف الإيردروب</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل وصفاً مفصلاً للإيردروب" 
                      {...field} 
                      className="bg-background/5 border-white/10 text-white min-h-[80px]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">تاريخ البدء</FormLabel>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={ar}
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white">تاريخ الانتهاء (اختياري)</FormLabel>
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={ar}
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="twitterLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">رابط تويتر</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="أدخل رابط سلسلة تويتر" 
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
              name="youtubeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">رابط يوتيوب (اختياري)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="أدخل رابط فيديو يوتيوب" 
                        {...field} 
                        className="pl-10 bg-background/5 border-white/10 text-white" 
                      />
                      <Youtube className="absolute right-3 top-2.5 h-5 w-5 text-white/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-0 space-x-reverse space-y-0 rounded-md p-4 bg-background/5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="ml-2 data-[state=checked]:bg-crypto-orange data-[state=checked]:border-crypto-orange"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white text-sm">
                      أوافق على الشروط والأحكام وسياسة الخصوصية
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white mt-4"
            >
              إضافة الإيردروب
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AirdropFormSection;
