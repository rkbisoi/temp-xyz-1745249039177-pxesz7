import { useState, useMemo, useEffect } from 'react';

interface DataListOptions<T> {
  initialData: T[];
  getItemId: (item: T) => number;
  filterFunction?: (item: T, searchTerm: string, filters: Record<string, string>) => boolean;
  sortFunction?: (a: T, b: T, sortOrder: string) => number;
  initialFilters?: Record<string, string>;
  itemsPerPage?: number;
}

export function useDataList<T>({
  initialData,
  getItemId,
  filterFunction,
  sortFunction,
  initialFilters = {},
  itemsPerPage = 10
}: DataListOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);


  useEffect(() => {
    setData(initialData);
    setCurrentPage(1); // optionally reset to first page if data changes
  }, [initialData]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    // First filter the data
    let filtered = data;
    
    if (filterFunction) {
      filtered = data.filter(item => filterFunction(item, searchTerm, filters));
    }

    // Then sort the data
    if (sortFunction && filters.dateSort) {
      return [...filtered].sort((a, b) => sortFunction(a, b, filters.dateSort));
    }

    return filtered;
  }, [data, filters, searchTerm, filterFunction, sortFunction]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Selection handling
  const toggleItemSelection = (itemId: number, isSelected?: boolean) => {
    const newSelected = new Set(selectedItems);
    
    if (isSelected === undefined) {
      // Toggle
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
    } else if (isSelected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    
    setSelectedItems(newSelected);
  };

  const toggleAllSelection = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(new Set(filteredAndSortedData.map(item => getItemId(item))));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Update functions
  const updateData = (newData: T[]) => {
    setData(newData);
    setCurrentPage(1);
  };

  const updateFilters = (newFilters: Record<string, string>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    data,
    filteredData: filteredAndSortedData,
    paginatedData,
    selectedItems,
    filters,
    searchTerm,
    showFilters,
    currentPage,
    totalPages,
    activeDropdown,
    selectedItem,
    totalItems: filteredAndSortedData.length,
    setData: updateData,
    setSearchTerm,
    setFilters: updateFilters,
    setShowFilters,
    setActiveDropdown,
    setSelectedItem,
    toggleItemSelection,
    toggleAllSelection,
    handleNextPage,
    handlePrevPage,
    clearSelectedItems: () => setSelectedItems(new Set())
  };
}