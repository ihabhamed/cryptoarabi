
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'footer' | 'social';
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  type
}) => {
  const title = type === 'footer' ? 'حذف الرابط' : 'حذف رابط التواصل الاجتماعي';
  const description = type === 'footer' 
    ? 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الرابط نهائيًا.'
    : 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف رابط التواصل الاجتماعي نهائيًا.';

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-crypto-darkGray border border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-crypto-orange">هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
            onClick={onCancel}
          >
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
