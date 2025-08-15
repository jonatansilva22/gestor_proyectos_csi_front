import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  roleFilter: string;
  onRoleChange: (role: string) => void;
  totalUsers: number;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  totalUsers,
}) => {
  const { darkMode } = useTheme();

  const hasActiveFilters = searchTerm.trim() || roleFilter;
  const clearFilters = () => {
    onSearchChange('');
    onRoleChange('');
  };

  return (
    <div className={`rounded-2xl shadow-lg border p-6 mb-6 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side - Search and Role Filter */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre, username, email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-500/20 focus:ring-offset-gray-800'
                  : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 focus:ring-offset-white'
              } ${searchTerm ? 'border-purple-500' : ''}`}
            />
            <svg
              className={`absolute left-4 top-3.5 w-5 h-5 ${
                searchTerm 
                  ? (darkMode ? 'text-purple-400' : 'text-purple-500')
                  : (darkMode ? 'text-gray-400' : 'text-gray-400')
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className={`absolute right-3 top-3.5 w-5 h-5 rounded-full flex items-center justify-center ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                } transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => onRoleChange(e.target.value)}
              className={`appearance-none pl-4 pr-10 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 cursor-pointer min-w-[180px] ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-500/20 focus:ring-offset-gray-800'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-purple-500 focus:ring-purple-500/20 focus:ring-offset-white'
              } ${roleFilter ? 'border-purple-500' : ''}`}
            >
              <option value="">🌟 Todos los roles</option>
              <option value="1">🛠️ Admin</option>
              <option value="2">👑 SuperAdmin</option>
              <option value="3">👤 Colaborador</option>
            </select>
            <svg
              className={`absolute right-3 top-4 w-4 h-4 pointer-events-none ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Right side - Stats and Actions */}
        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar
            </button>
          )}

          <div className={`px-5 py-3 rounded-xl font-semibold flex items-center gap-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 border border-gray-600 shadow-lg'
              : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-300 shadow-sm'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className="text-lg">{totalUsers}</span>
            <span className="text-sm opacity-80">usuario{totalUsers !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className={`mt-4 pt-4 border-t ${
          darkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Filtros activos:
            </span>
            {searchTerm && (
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                darkMode 
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-600'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                Búsqueda: "{searchTerm}"
              </span>
            )}
            {roleFilter && (
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                darkMode 
                  ? 'bg-purple-900/50 text-purple-300 border border-purple-600'
                  : 'bg-purple-100 text-purple-700 border border-purple-200'
              }`}>
                Rol: {roleFilter === '1' ? 'Admin' : roleFilter === '2' ? 'SuperAdmin' : 'Colaborador'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;