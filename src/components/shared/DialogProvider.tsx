import React, { createContext, useContext, useState, useCallback } from 'react';
import Dialog, { DialogType } from './Dialog';

interface DialogOptions {
  title: string;
  message?: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: DialogOptions;
  }>({
    isOpen: false,
    options: {
      title: '',
    },
  });

  const showDialog = useCallback((options: DialogOptions) => {
    setDialogState({
      isOpen: true,
      options,
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  // const handleConfirm = () => {
  //   if (dialogState.options.onConfirm) {
  //     dialogState.options.onConfirm();
  //   }
  //   hideDialog();
  // };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <Dialog
        isOpen={dialogState.isOpen}
        onClose={hideDialog}
        {...dialogState.options}
        // onConfirm={handleConfirm}
      />
    </DialogContext.Provider>
  );
};