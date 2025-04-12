
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

const formSchema = z.object({
  title: z.string().min(5, { message: "العنوان يجب أن يكون على الأقل 5 أحرف" }),
  description: z.string().min(20, { message: "الوصف يجب أن يكون على الأقل 20 حرف" }),
  startDate: z.date({ required_error: "يرجى اختيار تاريخ البدء" }),
  endDate: z.date({ required_error: "يرجى اختيار تاريخ الانتهاء" }).optional(),
  twitterLink: z.string().url({ message: "يرجى إدخال رابط صحيح" }),
  youtubeLink: z.string().url({ message: "يرجى إدخال رابط صحيح" }).optional(),
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
    <div className="container-custom mx-auto section-padding">
      <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-8 text-center">أضف إيردروب جديد</h2>
      
      <Card className="bg-crypto-darkGray border-white/10 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white text-2xl">تفاصيل الإيردروب</CardTitle>
          <CardDescription className="text-white/70">قم بإضافة تفاصيل الإيردروب الجديد هنا</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">عنوان الإيردروب</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل عنوان الإيردروب" {...field} />
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
                      <Textarea placeholder="أدخل وصفاً مفصلاً للإيردروب" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
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
                        <Input placeholder="أدخل رابط سلسلة تويتر" {...field} className="pl-10" />
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
                        <Input placeholder="أدخل رابط فيديو يوتيوب" {...field} className="pl-10" />
                        <Youtube className="absolute right-3 top-2.5 h-5 w-5 text-white/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white"
              >
                إضافة الإيردروب
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirdropFormSection;
