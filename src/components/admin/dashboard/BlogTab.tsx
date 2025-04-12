
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useBlogPosts, useDeleteBlogPost } from '@/lib/hooks';
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

const BlogTab = () => {
  const navigate = useNavigate();
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useBlogPosts();
  const { toast } = useToast();
  const deleteBlogPost = useDeleteBlogPost();
  const { 
    itemToDelete, 
    isDialogOpen, 
    setIsDialogOpen, 
    openDeleteDialog, 
    handleDeleteConfirm 
  } = useDeleteDialog<'blog'>('blog', deleteBlogPost, 
    () => toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف المنشور بنجاح",
    }),
    (error) => toast({
      variant: "destructive",
      title: "خطأ في الحذف",
      description: error.message || "حدث خطأ أثناء محاولة الحذف",
    })
  );

  const handleAddNew = () => {
    navigate('/admin/blog/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">إدارة المدونة</h3>
        <Button 
          onClick={handleAddNew}
          className="bg-crypto-orange hover:bg-crypto-orange/80 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة منشور جديد</span>
        </Button>
      </div>
      
      {isLoadingBlogPosts ? (
        <div className="flex justify-center py-12">
          <RefreshCcw className="h-8 w-8 text-crypto-orange animate-spin" />
        </div>
      ) : blogPosts?.length === 0 ? (
        <div className="text-center py-12 text-white/70">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
          <p>لا توجد منشورات حتى الآن</p>
          <Button 
            onClick={handleAddNew} 
            variant="link" 
            className="mt-2 text-crypto-orange"
          >
            إضافة أول منشور
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogPosts?.map((post) => (
            <Card key={post.id} className="bg-crypto-darkBlue/30 border border-white/10 transition-all hover:bg-crypto-darkBlue/50">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{post.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                      <span>{post.author || 'غير معروف'}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publish_date)}
                      </span>
                      {post.category && (
                        <span className="bg-crypto-darkBlue/50 px-2 py-0.5 rounded-full text-xs">
                          {post.category}
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
                          <p><strong>العنوان:</strong> {post.title}</p>
                          <p><strong>الكاتب:</strong> {post.author || 'غير معروف'}</p>
                          <p><strong>المستخلص:</strong> {post.excerpt || 'لا يوجد مستخلص'}</p>
                          <p><strong>تاريخ النشر:</strong> {formatDate(post.publish_date)}</p>
                          <p><strong>التصنيف:</strong> {post.category || 'غير مصنف'}</p>
                          <p><strong>الرابط الثابت:</strong> {post.slug || 'غير محدد'}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                      className="text-white border-white/20 hover:bg-white/10 hover:text-crypto-orange"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteDialog(post.id)}
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

export default BlogTab;
