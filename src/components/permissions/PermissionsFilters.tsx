// src/components/permissions/PermissionsFilters.tsx
import React from 'react';
import { UserFilters, USER_STATUS_LABELS } from '../../types/permissions';
import { useTheme } from '../../context/ThemeContext';

interface PermissionsFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
}

export const PermissionsFilters: React.FC<PermissionsFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { darkMode } = useTheme();

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <div className={`p-6 border-b ${
      darkMode 
        ? 'bg-[#2D1B4E] border-purple-700/40' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex flex-wrap gap-6 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-48">
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="">Todos los estados</option>
            {Object.entries(USER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filter */}
        <div className="min-w-48">
          <select
            value={filters.isActive === undefined ? '' : filters.isActive.toString()}
            onChange={(e) => 
              handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')
            }
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="min-w-48">
          <select
            value={filters.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="">Ordenar por</option>
            <option value="name">Nombre</option>
            <option value="email">Email</option>
            <option value="status">Estado</option>
            <option value="createdAt">Fecha de creación</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="min-w-32">
          <select
            value={filters.sortOrder || 'asc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className={`w-full px-3 py-2 rounded-md border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className={`px-4 py-2 rounded-md border transition-colors ${
            darkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};