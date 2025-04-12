
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddAirdrop } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import { NewAirdrop } from "@/types/supabase";
import { airdropFormSchema, AirdropFormValues } from "@/lib/validations/airdropSchema";

export function useAirdropSubmit() {
  const { toast } = useToast();
  const addAirdrop = useAddAirdrop();

  const form = useForm<AirdropFormValues>({
    resolver: zodResolver(airdropFormSchema),
    defaultValues: {
      title: "",
      description: "",
      twitter_link: "",
      youtube_link: "",
    },
  });

  function onSubmit(data: AirdropFormValues) {
    const currentDate = new Date();
    
    // Add start_date and set status, convert dates to ISO strings
    const airdropData: NewAirdrop = {
      title: data.title,
      description: data.description || null,
      twitter_link: data.twitter_link,
      youtube_link: data.youtube_link || null,
      start_date: currentDate.toISOString(),
      status: 'active', // This will be treated as a string in our updated type
    };
    
    // Only add end_date if it exists
    if (data.end_date) {
      airdropData.end_date = data.end_date.toISOString();
    }
    
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

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: addAirdrop.isPending
  };
}
