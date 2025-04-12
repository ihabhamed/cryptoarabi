
import { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

// Generic hook for managing delete dialogs with consistent UX
export function useDeleteDialog<T extends 'airdrop' | 'blog' | 'service'>(
  deleteType: T,
  deleteMutation: UseMutationResult<any, Error, string, unknown>,
  onSuccess: () => void,
  onError: (error: Error) => void
) {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async (id: string | null) => {
    if (!id) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      onSuccess();
      setIsDialogOpen(false);
    } catch (error: any) {
      onError(error);
    }
  };

  return {
    itemToDelete,
    isDialogOpen,
    setIsDialogOpen,
    openDeleteDialog,
    handleDeleteConfirm
  };
}
