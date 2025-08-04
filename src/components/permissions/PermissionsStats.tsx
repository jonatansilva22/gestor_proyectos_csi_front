// src/components/permissions/PermissionsStats.tsx
import React from 'react';
import { UserStats } from '../../types/permissions';
import { useTheme } from '../../context/ThemeContext';

interface PermissionsStatsProps {
  stats: UserStats;
  loading?: boolean;
}

export const PermissionsStats: React.FC<PermissionsStatsProps> = ({
  stats,
  loading = false,
}) => {
  const { darkMode } = useTheme();

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ${
        darkMode ? 'bg-[#2D1B4E]' : 'bg-gray-50'
      }`}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } animate-pulse`}
          >
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Usuarios',
      value: stats.totalUsers,
      color: 'purple',
      icon: '👥',
    },
    {
      title: 'Usuarios Activos',
      value: stats.activeUsers,
      color: 'green',
      icon: '✅',
    },
    {
      title: 'Usuarios Inactivos',
      value: stats.inactiveUsers,
      color: 'gray',
      icon: '⚪',
    },
    {
      title: 'Con Permisos Completos',
      value: stats.usersWithFullPermissions,
      color: 'red',
      icon: '🔒',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: darkMode ? 'text-purple-300 bg-purple-900/20' : 'text-purple-600 bg-purple-50',
      green: darkMode ? 'text-green-300 bg-green-900/20' : 'text-green-600 bg-green-50',
      gray: darkMode ? 'text-gray-300 bg-gray-700/20' : 'text-gray-600 bg-gray-50',
      red: darkMode ? 'text-red-300 bg-red-900/20' : 'text-red-600 bg-red-50',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ${
      darkMode ? 'bg-[#2D1B4E]' : 'bg-gray-50'
    }`}>
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
            darkMode
              ? 'bg-[#3A2B5A] border-purple-700/40'
              : 'bg-white border-purple-200'
          } ${getColorClasses(card.color)}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {card.value}
              </p>
            </div>
            <div className="text-2xl opacity-80">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};