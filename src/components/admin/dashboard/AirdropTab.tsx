
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useAirdrops, useDeleteAirdrop } from '@/lib/hooks';
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
  Calendar
} from "lucide-react";

const AirdropTab = () => {
  const navigate = useNavigate();
  const { data: airdrops, isLoading: isLoadingAirdrops } = useAirdrops();
  const { toast } = useToast();
  const deleteAirdrop = useDeleteAirdrop();
  const { 
    itemToDelete, 
    isDialogOpen, 
    setIsDialogOpen, 
    openDeleteDialog, 
    handleDeleteConfirm 
  } = useDeleteDialog<'airdrop'>('airdrop', deleteAirdrop, 
    () => toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الإيردروب بنجاح",
    }),
    (error) => toast({
      variant: "destructive",
      title: "خطأ في الحذف",
      description: error.message || "حدث خطأ أثناء محاولة الحذف",
    })
  );

  const handleAddNew = () => {
    navigate('/admin/airdrops/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/airdrops/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">إدارة الإيردروب</h3>
        <Button 
          onClick={handleAddNew}
          className="bg-crypto-orange hover:bg-crypto-orange/80 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة إيردروب جديد</span>
        </Button>
      </div>
      
      {isLoadingAirdrops ? (
        <div className="flex justify-center py-12">
          <RefreshCcw className="h-8 w-8 text-crypto-orange animate-spin" />
        </div>
      ) : airdrops?.length === 0 ? (
        <div className="text-center py-12 text-white/70">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
          <p>لا توجد إيردروب حتى الآن</p>
          <Button 
            onClick={handleAddNew} 
            variant="link" 
            className="mt-2 text-crypto-orange"
          >
            إضافة أول إيردروب
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {airdrops?.map((airdrop) => (
            <Card key={airdrop.id} className="bg-crypto-darkBlue/30 border border-white/10 transition-all hover:bg-crypto-darkBlue/50">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{airdrop.title}</h4>
                    <p className="text-sm text-white/60 mt-1">
                      الحالة: <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        airdrop.status === 'active' ? 'bg-green-900/60 text-green-300' :
                        airdrop.status === 'upcoming' ? 'bg-blue-900/60 text-blue-300' :
                        'bg-red-900/60 text-red-300'
                      }`}>
                        {airdrop.status === 'active' ? 'نشط' : 
                         airdrop.status === 'upcoming' ? 'قادم' : 'منتهي'}
                      </span>
                    </p>
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
                          <p><strong>العنوان:</strong> {airdrop.title}</p>
                          <p><strong>الوصف:</strong> {airdrop.description || 'لا يوجد وصف'}</p>
                          <p><strong>تاريخ النشر:</strong> {formatDate(airdrop.publish_date)}</p>
                          <p><strong>تاريخ البداية:</strong> {airdrop.start_date ? formatDate(airdrop.start_date) : 'غير محدد'}</p>
                          <p><strong>تاريخ النهاية:</strong> {airdrop.end_date ? formatDate(airdrop.end_date) : 'غير محدد'}</p>
                          <p><strong>الحالة:</strong> {airdrop.status}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(airdrop.id)}
                      className="text-white border-white/20 hover:bg-white/10 hover:text-crypto-orange"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteDialog(airdrop.id)}
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

export default AirdropTab;
