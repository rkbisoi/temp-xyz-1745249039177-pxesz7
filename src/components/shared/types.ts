import { BaseItem } from "../../types";

export interface ListConfig {
    title: string;
    addButtonText: string;
    searchPlaceholder: string;
    itemsName: string;
    showProgress?: boolean;
    showMembers?: boolean;
    showStatus?: boolean;
    showType?: boolean;
    showGlobal?: boolean;
    showRole?: boolean;
    showMember?: boolean;
    showSchedule?: boolean;
    statusOptions?: string[];
    sortOptions?: {
      key: string;
      label: string;
    }[];
    bulkActions?: {
      label: string;
      action: string;
      icon?: JSX.Element;
    }[];
  }
  
  export interface BulkActionsProps {
    selectedItems: BaseItem[];
    onAction: (action: string) => void;
    actions: ListConfig['bulkActions'];
  }
  
  export interface ListHeaderProps {
    title: string;
    addButtonText: string;
    onAddItem: () => void;
  }
  
  export interface ListFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    sortBy: string;
    onSortChange: (field: string) => void;
    sortOrder: 'asc' | 'desc';
    config: ListConfig;
  }
  
  export interface ListItemCardProps {
    item: BaseItem;
    config: ListConfig;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onView: (id: number) => void;
    getStatusColor?: (status: string) => string;
  }
  
  export interface ListPaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    startIndex: number;
    itemsName: string;
    onPageChange: (page: number) => void;
  }


  