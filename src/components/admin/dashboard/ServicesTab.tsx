
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useServices, useDeleteService } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { useDeleteDialog } from '@/hooks/useDeleteDialog';
import { DeleteConfirmationDialog } from '@/components/admin/dashboard/DeleteConfirmationDialog';
import { 
  RefreshCcw, 
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Clock
} from "lucide-react";

const ServicesTab = () => {
  const navigate = useNavigate();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { toast } = useToast();
  const deleteService = useDeleteService();
  const { 
    itemToDelete, 
    isDialogOpen, 
    setIsDialogOpen, 
    openDeleteDialog, 
    handleDeleteConfirm 
  } = useDeleteDialog<'service'>('service', deleteService, 
    () => toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الخدمة بنجاح",
    }),
    (error) => toast({
      variant: "destructive",
      title: "خطأ في الحذف",
      description: error.message || "حدث خطأ أثناء محاولة الحذف",
    })
  );

  const handleAddNew = () => {
    navigate('/admin/services/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/services/edit/${id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">إدارة الخدمات</h3>
        <Button 
          onClick={handleAddNew}
          className="bg-crypto-orange hover:bg-crypto-orange/80 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة خدمة جديدة</span>
        </Button>
      </div>
      
      {isLoadingServices ? (
        <div className="flex justify-center py-12">
          <RefreshCcw className="h-8 w-8 text-crypto-orange animate-spin" />
        </div>
      ) : services?.length === 0 ? (
        <div className="text-center py-12 text-white/70">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
          <p>لا توجد خدمات حتى الآن</p>
          <Button 
            onClick={handleAddNew} 
            variant="link" 
            className="mt-2 text-crypto-orange"
          >
            إضافة أول خدمة
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {services?.map((service) => (
            <Card key={service.id} className="bg-crypto-darkBlue/30 border border-white/10 transition-all hover:bg-crypto-darkBlue/50">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{service.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
                      {service.price && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {service.price}
                        </span>
                      )}
                      {service.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-white/70 hover:text-white hover:bg-crypto-darkBlue/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 bg-crypto-darkBlue border border-white/10 text-white p-4">
                        <div className="space-y-2">
                          <p><strong>العنوان:</strong> {service.title}</p>
                          <p><strong>الوصف:</strong> {service.description || 'لا يوجد وصف'}</p>
                          <p><strong>السعر:</strong> {service.price || 'غير محدد'}</p>
                          <p><strong>المدة:</strong> {service.duration || 'غير محددة'}</p>
                          {service.image_url && (
                            <p><strong>صورة:</strong> متوفرة</p>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(service.id)}
                      className="text-white border-white/20 hover:bg-white/10 hover:text-crypto-orange"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteDialog(service.id)}
                      className="bg-red-900/60 hover:bg-red-800 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onConfirm={() => handleDeleteConfirm(itemToDelete)}
      />
    </>
  );
};

export default ServicesTab;
