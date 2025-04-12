
import { z } from "zod";

export const airdropFormSchema = z.object({
  title: z.string().min(3, { message: "يجب أن يكون اسم الإيردروب 3 أحرف على الأقل" }),
  description: z.string().optional(),
  twitter_link: z.string().url({ message: "يرجى إدخال رابط تويتر صحيح" }),
  youtube_link: z.string().url({ message: "يرجى إدخال رابط يوتيوب صحيح" }).optional().or(z.literal('')),
  end_date: z.date().optional(),
});

export type AirdropFormValues = z.infer<typeof airdropFormSchema>;
