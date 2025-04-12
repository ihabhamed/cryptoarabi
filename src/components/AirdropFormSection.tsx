
import React from 'react';
import { useAirdropSubmit } from '@/hooks/useAirdropSubmit';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AirdropFormFields from '@/components/airdrop/AirdropFormFields';

const AirdropFormSection = () => {
  const { form, onSubmit, isSubmitting } = useAirdropSubmit();

  return (
    <Card className="bg-crypto-darkGray border-white/10 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-white text-2xl">شرح الإيردروب</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <AirdropFormFields />
            
            <Button 
              type="submit" 
              className="w-full bg-crypto-orange hover:bg-crypto-orange/80 text-white mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري التقديم..." : "تقديم الإيردروب"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AirdropFormSection;
