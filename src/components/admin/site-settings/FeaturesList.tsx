
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, Pencil } from "lucide-react";

interface FeaturesListProps {
  features: string[];
  onChange: (features: string[]) => void;
}

/**
 * FeaturesList Component
 * Manages a list of features with add/edit/remove functionality
 */
const FeaturesList: React.FC<FeaturesListProps> = ({ features, onChange }) => {
  const [newFeature, setNewFeature] = React.useState('');
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  /**
   * Add a new feature to the features list
   */
  const addFeature = () => {
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  /**
   * Remove a feature from the features list
   * @param index - Index of the feature to remove
   */
  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  /**
   * Update an existing feature
   * @param index - Index of the feature to update
   * @param value - New feature value
   */
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    onChange(newFeatures);
  };

  /**
   * Handle Enter key press in the new feature input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-white flex items-center">
        <span>مميزات الشركة</span>
        <span className="text-xs text-gray-400 mr-2">(يمكنك إضافة، تعديل، أو حذف المميزات)</span>
      </Label>
      
      <div className="space-y-3">
        {/* List of existing features */}
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input 
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              className="bg-crypto-darkBlue/30 border-white/10 text-white"
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setEditingIndex(index === editingIndex ? null : index)}
              className="shrink-0 border-white/10 hover:bg-crypto-orange/20"
            >
              <Pencil className="h-4 w-4 text-crypto-orange" />
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={() => removeFeature(index)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add new feature input */}
        <div className="flex gap-2">
          <Input 
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="أضف ميزة جديدة..."
            className="bg-crypto-darkBlue/30 border-white/10 text-white"
          />
          <Button 
            type="button" 
            variant="secondary"
            onClick={addFeature}
            disabled={!newFeature.trim()}
            className="shrink-0"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            إضافة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesList;
