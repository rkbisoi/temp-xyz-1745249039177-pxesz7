import { BulkActionsProps } from './types';

export default function BulkActions({ selectedItems, onAction, actions }: BulkActionsProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-intelQEDarkBlue shadow-lg rounded-lg border border-gray-200 px-4 py-2 flex items-center gap-2 z-49">
      <span className="text-sm text-gray-50 mr-2">
        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
      </span>
      <div className="h-4 w-px bg-gray-300 mx-2" />
      {actions?.map(({ label, action, icon }) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          className="flex items-center text-white gap-1 px-3 py-1 text-sm rounded-md hover:bg-gray-100 hover:text-intelQEDarkBlue"
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}