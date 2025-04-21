import React from 'react';
import { BulkActionsMenu, NoResults, Pagination } from './ReusableComponents';


export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  cellClassName?: string;
  headerClassName?: string;
  renderCell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getItemId: (item: T) => number;
  selectedItems: Set<number>;
  onToggleSelection: (id: number, selected?: boolean) => void;
  onToggleAllSelection: (selected: boolean) => void;
  onRowClick?: (item: T) => void;
  renderRowActions?: (item: T) => React.ReactNode;
  onBulkDelete?: () => void;
  onBulkCopy?: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  getItemId,
  selectedItems,
  onToggleSelection,
  onToggleAllSelection,
  onRowClick,
  renderRowActions,
  onBulkDelete,
  onBulkCopy,
  currentPage,
  totalPages,
  totalItems,
  onPrevPage,
  onNextPage,
  emptyMessage = "No items found",
  rowClassName
}: DataTableProps<T>) {
  
  // Handle checkbox click without triggering row click
  const handleCheckboxClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onToggleSelection(id);
  };

  const handleHeaderCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleAllSelection(e.target.checked);
  };

  if (data.length === 0) {
    return <NoResults message={emptyMessage} />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedItems.size === data.length && data.length > 0}
                  onChange={handleHeaderCheckboxClick}
                  className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                />
              </th>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName}`}
                >
                  {column.header}
                </th>
              ))}
              {renderRowActions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const id = getItemId(item);
              return (
                <tr
                  key={id}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName?.(item) || ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  <td className="pl-6 pr-2 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(id)}
                      onClick={(e) => handleCheckboxClick(e, id)}
                      onChange={() => {}} // React requires onChange handler when using checked
                      className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                    />
                  </td>
                  {columns.map((column, colIndex) => {
                    const cellContent = typeof column.accessor === 'function' 
                      ? column.accessor(item)
                      : column.renderCell 
                        ? column.renderCell(item) 
                        : (item[column.accessor] as React.ReactNode);
                    
                    return (
                      <td 
                        key={colIndex} 
                        className={`px-4 py-4 ${column.cellClassName || ''}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                  {renderRowActions && (
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {renderRowActions(item)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />

      {onBulkDelete && onBulkCopy && selectedItems.size > 0 && (
        <BulkActionsMenu
          selectedCount={selectedItems.size}
          onDeleteAction={onBulkDelete}
          onCopyAction={onBulkCopy}
        />
      )}
    </>
  );
}