import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { User } from '../../../types/user';
import UserActions from './UserActions';
import ResponsiveTable, { ResponsiveTableColumn } from '../../../components/common/ResponsiveTable';
import { ROLE_NAMES } from '../../../const/index';
import { toMediaUrl } from '../../../utils/media';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  currentUserId?: number;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  onEditUser,
  onDeleteUser,
  currentUserId,
}) => {
  const { darkMode } = useTheme();

  const getRoleColor = (roleId: number) => {
    switch (roleId) {
      case 1: // Admin
        return darkMode 
          ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 text-purple-300 border-purple-600/60 shadow-lg'
          : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 shadow-sm';
      case 2: // SuperAdmin
        return darkMode 
          ? 'bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300 border-red-600/60 shadow-lg'
          : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200 shadow-sm';
      case 3: // Colaborador
        return darkMode 
          ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-300 border-green-600/60 shadow-lg'
          : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-sm';
      default:
        return darkMode 
          ? 'bg-gradient-to-r from-gray-800/40 to-gray-700/40 text-gray-300 border-gray-600/60'
          : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const columns: ResponsiveTableColumn<User>[] = [
    {
      key: 'user',
      header: 'Usuario',
      accessor: (user) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10">
            {user.photo ? (
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={toMediaUrl(user.photo) || undefined} 
                alt={user.username} 
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg ring-2 ring-purple-400/30">
                {getUserInitials(user.first_name, user.last_name, user.username)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <div className={`text-sm font-medium truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user.username
                }
              </div>
              {currentUserId === user.id && (
                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
                  darkMode 
                    ? 'bg-blue-600/20 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  Tú
                </span>
              )}
            </div>
            <div className={`text-sm truncate ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              @{user.username}
            </div>
            {/* Mobile: Show email below username */}
            <div className={`md:hidden text-xs truncate mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {user.email}
            </div>
          </div>
        </div>
      ),
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Usuario'
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (user) => (
        <div className={`text-sm truncate ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {user.email}
        </div>
      ),
      className: 'text-left',
      priority: 'medium',
      hideOnMobile: true // Shown with user info on mobile
    },
    {
      key: 'role',
      header: 'Rol',
      accessor: (user) => {
        const getRoleName = (roleId: number, roleName?: string) => {
          // Use role_name from backend if available
          if (roleName) {
            return roleName;
          }
          
          // Fallback to ID mapping - corrected: 1=Admin, 2=SuperAdmin
          return ROLE_NAMES[roleId as keyof typeof ROLE_NAMES] || 'Usuario';
        };
        
        const roleId = (user as any).role_id || user.role;
        const roleName = user.role_name;
        
        const roleIcon = roleId === 2 ? '👑' : roleId === 1 ? '🛠️' : '👤'; // 2=SuperAdmin gets crown, 1=Admin gets tools
        
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
            getRoleColor(roleId)
          }`}>
            <span className="text-sm">{roleIcon}</span>
            {getRoleName(roleId, roleName)}
          </span>
        );
      },
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Rol'
    },
    {
      key: 'dates',
      header: 'Fechas',
      accessor: (user) => (
        <div className="text-sm space-y-1">
          <div className={`flex items-center gap-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">Creado: {formatDate(user.created_at)}</span>
          </div>
          <div className={`flex items-center gap-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs">Actualizado: {formatDate(user.updated_at)}</span>
          </div>
        </div>
      ),
      className: 'text-left',
      priority: 'low',
      mobileLabel: 'Fechas'
    },
    {
      key: 'actions',
      header: 'Acciones',
      accessor: (user) => (
        <UserActions 
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          currentUserId={currentUserId}
        />
      ),
      className: 'text-center',
      headerClassName: 'text-center',
      priority: 'high',
      mobileLabel: 'Acciones'
    }
  ];

  return (
    <ResponsiveTable
      data={users}
      columns={columns}
      keyExtractor={(user) => user.id.toString()}
      loading={loading}
      emptyMessage="No se encontraron usuarios"
    />
  );
};

export default UsersTable;
