import React from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Trash2, Copy, MoreHorizontal } from 'lucide-react';

// Search and filter bar component
interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  placeholder?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  placeholder = "Search..."
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300"
        />
      </div>
      <button
        onClick={onToggleFilters}
        className="p-2 border rounded-md hover:bg-gray-50"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
};

// Filter dropdown component
interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-300"
      aria-label={label}
    >
      <option value="">{label}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPrevPage,
  onNextPage
}) => {
  if (totalItems === 0) return null;
  
  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <span className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        {' '} - Total {totalItems} items
      </span>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Actions menu for selected items
interface BulkActionsMenuProps {
  selectedCount: number;
  onDeleteAction: () => void;
  onCopyAction: () => void;
  className?: string;
}

export const BulkActionsMenu: React.FC<BulkActionsMenuProps> = ({
  selectedCount,
  onDeleteAction,
  onCopyAction,
  className = "fixed bottom-4 right-10"
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className={`flex gap-4 bg-white shadow-lg p-2 rounded-lg border ${className}`}>
      <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
        {selectedCount} Item{selectedCount !== 1 ? 's' : ''} Selected
      </span>
      <button
        onClick={onDeleteAction}
        className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </button>
      <button
        onClick={onCopyAction}
        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
      >
        <Copy className="h-4 w-4 mr-1" />
        Copy
      </button>
    </div>
  );
};

// Row action dropdown
interface RowActionOption {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface RowActionsMenuProps {
  isOpen: boolean;
  options: RowActionOption[];
  onToggle: () => void;
  stopPropagation?: boolean;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  isOpen,
  options,
  onToggle,
  stopPropagation = true
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    onToggle();
  };

  return (
    <div className="z-10 w-28 flex justify-end mr-8">
      <button
        onClick={handleClick}
        className="text-gray-400 hover:text-gray-600 flex justify-end"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => {
                  if (stopPropagation) e.stopPropagation();
                  option.onClick();
                }}
                className={`flex items-center px-4 py-2 text-sm w-full hover:bg-gray-100 ${option.className || 'text-gray-700'}`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// No results message
interface NoResultsProps {
  message?: string;
}

export const NoResults: React.FC<NoResultsProps> = ({ 
  message = "No items found matching your filters." 
}) => (
  <div className="text-center py-8 text-gray-500">
    {message}
  </div>
);