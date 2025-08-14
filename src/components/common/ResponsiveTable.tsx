import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface ResponsiveTableColumn<T = any> {
  key: string;
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  priority?: 'high' | 'medium' | 'low'; // Priority for column hiding on smaller screens
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: ResponsiveTableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  className = '',
  emptyMessage = 'No hay datos disponibles',
  loading = false,
  onRowClick
}: ResponsiveTableProps<T>) {
  const { darkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  // Filter columns based on screen size and priority
  const getVisibleColumns = () => {
    if (isMobile) {
      return columns.filter(col => !col.hideOnMobile && col.priority === 'high');
    } else if (isTablet) {
      return columns.filter(col => col.priority !== 'low');
    }
    return columns;
  };

  const visibleColumns = getVisibleColumns();

  const getCellValue = (item: T, column: ResponsiveTableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor] as React.ReactNode;
  };

  if (loading) {
    return (
      <div className={`rounded-2xl shadow-2xl border backdrop-blur-sm p-8 transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700/50 shadow-black/20' 
          : 'bg-white/95 border-gray-100/50 shadow-gray-900/10'
      }`}>
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${
            darkMode ? 'border-purple-400' : 'border-purple-600'
          }`}></div>
          <span className={`ml-3 font-medium ${
            darkMode ? 'text-purple-200' : 'text-gray-600'
          }`}>
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`rounded-2xl shadow-2xl border backdrop-blur-sm p-8 text-center transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700/50 shadow-black/20' 
          : 'bg-white/95 border-gray-100/50 shadow-gray-900/10'
      }`}>
        <div className={`text-lg font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`responsive-table ${className}`}>
      {/* Desktop Table View */}
      <div className={`hidden md:block rounded-2xl shadow-2xl border backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700/50 shadow-black/20' 
          : 'bg-white/95 border-gray-100/50 shadow-gray-900/10'
      }`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${
            darkMode ? 'divide-gray-600/50' : 'divide-gray-200/70'
          }`}>
            <thead className={darkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-gray-50/80 backdrop-blur-sm'}>
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    } ${column.headerClassName || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-gray-600/30' : 'divide-gray-200/50'
            }`}>
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={`transition-all duration-200 ${
                    onRowClick ? 'cursor-pointer hover:scale-[1.01]' : ''
                  } ${
                    darkMode 
                      ? 'hover:bg-gray-700/50 hover:shadow-lg hover:shadow-purple-500/5' 
                      : 'hover:bg-gray-50/80 hover:shadow-lg hover:shadow-gray-900/5'
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-5 whitespace-nowrap ${
                        column.className || ''
                      }`}
                    >
                      {getCellValue(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className={`mobile-card rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 p-4 ${
              onRowClick ? 'cursor-pointer active:scale-95 hover:scale-[1.02]' : ''
            } ${
              darkMode 
                ? 'bg-gray-800/95 border-gray-700/50 hover:border-gray-600/60 shadow-black/20 hover:shadow-purple-500/10' 
                : 'bg-white/95 border-gray-200/50 hover:border-gray-300/60 shadow-gray-900/10 hover:shadow-gray-900/15'
            }`}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => {
              if (column.hideOnMobile) return null;
              
              const value = getCellValue(item, column);
              if (!value && value !== 0) return null;

              return (
                <div key={column.key} className={`flex justify-between items-center py-2 border-b last:border-b-0 ${
                  darkMode ? 'border-gray-600/30' : 'border-gray-200/50'
                }`}>
                  <span className={`mobile-card-label font-medium text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {column.mobileLabel || column.header}
                  </span>
                  <span className={`mobile-card-value font-medium text-sm text-right ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } ${column.className || ''}`}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponsiveTable;