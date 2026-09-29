import React, { createContext, useContext, useState } from 'react';

const initialFilters = {
  category: 'All',
  riskLevel: 'All',
  minFrp: '',
  maxFrp: '',
  satellite: 'All',
  startDate: '',
  endDate: '',
  searchQuery: '',
  status: 'All',
};

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilters,
        resetFilters,
        hasActiveFilters: Object.keys(filters).some((k) => filters[k] !== initialFilters[k]),
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
