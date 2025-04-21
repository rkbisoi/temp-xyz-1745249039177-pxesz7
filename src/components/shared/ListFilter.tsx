import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { ListFiltersProps } from './types';

export default function ListFilters({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  config,
}: ListFiltersProps) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className="p-2 border rounded-md hover:bg-gray-50"
            title="Show filters"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border rounded-md hover:bg-gray-50 flex items-center gap-2"
            title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? (
              <>
                <List className="h-5 w-5" />
                <span>List View</span>
              </>
            ) : (
              <>
                <LayoutGrid className="h-5 w-5" />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
          {config.statusOptions && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">All Status</option>
              {config.statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          )}
          {config.sortOptions && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              {config.sortOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => onSortChange(option.key)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === option.key ? 'bg-intelQEDarkBlue text-white' : 'bg-white'
                  }`}
                >
                  {option.label} {sortBy === option.key && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}