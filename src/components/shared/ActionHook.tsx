
import toast from 'react-hot-toast';
import { useDialog } from './DialogProvider';
import { emitter } from '../../utils/eventEmitter';


interface UseActionsOptions<T> {
  itemType: string;
  deleteFunc: (ids: number[]) => Promise<boolean>;
  onSuccess?: () => void;
  selectedItems?: Set<number>;
  clearSelection?: () => void;
  getItems?: (selectedIds: Set<number>) => T[];
}

export function useActions<T>({
  itemType,
  deleteFunc,
  onSuccess,
  selectedItems = new Set(),
  clearSelection = () => {},
  getItems
}: UseActionsOptions<T>) {
  const { showDialog } = useDialog();

  const confirmAction = (
    action: string, 
    itemId?: number, 
    callback?: () => Promise<void>
  ) => {
    const isMultiple = !itemId && selectedItems.size > 0;
    const target = isMultiple ? `selected ${itemType}s` : `this ${itemType}`;
    
    showDialog({
      title: `Confirm ${action}`,
      message: `Are you sure you want to ${action.toLowerCase()} ${target}?`,
      type: 'confirm',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        if (callback) {
          await callback();
        } else if (action === 'Delete') {
          await handleDelete(itemId);
        }
      }
    });
  };

  const handleDelete = async (itemId?: number) => {
    try {
      const ids = itemId ? [itemId] : Array.from(selectedItems);
      
      if (ids.length === 0) {
        toast.error(`No ${itemType}s selected for deletion.`);
        return;
      }
      
      const success = await deleteFunc(ids);
      
      if (success) {
        toast.success(`${itemId ? itemType : `${ids.length} ${itemType}s`} deleted successfully!`);
        if (!itemId) clearSelection();
        if (onSuccess) onSuccess();
        emitter.emit(`refresh${itemType.charAt(0).toUpperCase() + itemType.slice(1)}List`);
      } else {
        toast.error(`Failed to delete ${itemId ? itemType : 'some or all items'}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      toast.error(`An unexpected error occurred during deletion.`);
    }
  };

  const handleDeleteAction = (itemId?: number) => {
    confirmAction('Delete', itemId);
  };

  const handleCopyAction = (itemId?: number) => {
    confirmAction('Copy', itemId);
  };

  return {
    handleDeleteAction,
    handleCopyAction,
    confirmAction
  };
}