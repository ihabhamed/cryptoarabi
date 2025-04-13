
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, MoveUp, MoveDown, List as ListIcon } from "lucide-react";

interface AirdropStep {
  id: string;
  title: string;
  description: string;
}

interface StepsSectionProps {
  formData: { steps?: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StepsSection: React.FC<StepsSectionProps> = ({
  formData,
  handleChange,
}) => {
  // Parse steps from JSON string or initialize empty array
  const [steps, setSteps] = useState<AirdropStep[]>(() => {
    try {
      return formData.steps ? JSON.parse(formData.steps) : [];
    } catch (e) {
      return [];
    }
  });

  // Update the steps in the form
  const updateFormSteps = (updatedSteps: AirdropStep[]) => {
    const stepsJson = JSON.stringify(updatedSteps);
    
    // Create a synthetic event to use with handleChange
    const event = {
      target: {
        name: 'steps',
        value: stepsJson
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    handleChange(event);
  };

  // Add a new step
  const addStep = () => {
    const newStep: AirdropStep = {
      id: crypto.randomUUID(),
      title: '',
      description: ''
    };
    
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    updateFormSteps(updatedSteps);
  };

  // Remove a step
  const removeStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    setSteps(updatedSteps);
    updateFormSteps(updatedSteps);
  };

  // Update a step field
  const updateStep = (id: string, field: keyof AirdropStep, value: string) => {
    const updatedSteps = steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    );
    setSteps(updatedSteps);
    updateFormSteps(updatedSteps);
  };

  // Move a step up or down
  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSteps = [...steps];
    const [movedStep] = updatedSteps.splice(index, 1);
    updatedSteps.splice(newIndex, 0, movedStep);
    
    setSteps(updatedSteps);
    updateFormSteps(updatedSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ListIcon className="mr-2 h-5 w-5 text-crypto-orange" />
          <h3 className="text-lg font-medium text-white">خطوات الإيردروب (اختياري)</h3>
        </div>
        <Button 
          type="button"
          onClick={addStep}
          variant="outline"
          className="border-crypto-orange text-crypto-orange hover:bg-crypto-orange/10"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          إضافة خطوة
        </Button>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-white/20 rounded-md">
          <p className="text-white/60">لم يتم إضافة خطوات بعد. انقر على "إضافة خطوة" لإضافة الخطوات.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step.id} className="bg-crypto-darkBlue/50 border-white/10">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">الخطوة {index + 1}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                      className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/90 mb-1 text-sm">عنوان الخطوة</label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                      placeholder="أدخل عنوان الخطوة"
                      className="bg-crypto-darkBlue/30 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 mb-1 text-sm">تفاصيل الخطوة</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      placeholder="أدخل تفاصيل الخطوة"
                      className="bg-crypto-darkBlue/30 border-white/20 text-white min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepsSection;
