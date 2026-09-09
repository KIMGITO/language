import React from 'react';
import { useSafetyStore } from '../../stores/safetyStore';
import { AlertDialog } from '../ui/alert-dialog';

export function BlockDialog() {
  const {
    blockDialogOpen,
    closeBlockDialog,
    targetUser,
    confirmBlock,
    isSubmitting,
  } = useSafetyStore();

  if (!targetUser) return null;

  return (
    <AlertDialog
      open={blockDialogOpen}
      onOpenChange={closeBlockDialog}
      title={`Block ${targetUser.display_name}?`}
      description="They will no longer be able to message you or appear in your matches."
      confirmText="Block user"
      cancelText="Cancel"
      variant="destructive"
      isLoading={isSubmitting}
      onConfirm={confirmBlock}
    />
  );
}
