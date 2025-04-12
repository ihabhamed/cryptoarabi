
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  setIsOpen,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-crypto-darkGray border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-crypto-orange">تأكيد الحذف</DialogTitle>
        </DialogHeader>
        <p className="py-4">
          هل أنت متأكد من رغبتك في حذف هذا العنصر؟ هذا الإجراء لا يمكن التراجع عنه.
        </p>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            إلغاء
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-900/60 hover:bg-red-800 text-white"
          >
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
