import { Group } from "../../types/groups/Group";
import { EntityActions } from "../common/EntityActions";
import ResponsiveTable, { ResponsiveTableColumn } from "../common/ResponsiveTable";
import { useTheme } from "../../context/ThemeContext";
import { toMediaUrl } from "../../utils/media";

interface GroupsTableProps {
  groups: Group[];
  onDeleteClick: (group: Group) => void;
  onEditClick: (group: Group) => void;
}

export const GroupsTable = ({
  groups,
  onDeleteClick,
  onEditClick,
}: GroupsTableProps) => {
  const { darkMode } = useTheme();
  // Validar que groups sea un array
  if (!groups || !Array.isArray(groups)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de grupos disponibles</p>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    if (!dateString) return "dd/mm/yyyy";
    const date = new Date(dateString);
    return (
      <div className="text-sm">
        <div className={`font-medium ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {date.toLocaleDateString("es-ES", { 
            day: '2-digit', 
            month: '2-digit',
            year: '2-digit'
          })}
        </div>
        <div className={`text-xs hidden sm:block ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {date.toLocaleDateString("es-ES", { 
            weekday: 'short'
          })}
        </div>
      </div>
    );
  };

  const renderUsers = (users: Group['users']) => (
    <div className="space-y-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center space-x-2">
          <div className="flex-shrink-0 h-6 w-6">
            {user.photo ? (
              <img
                className="h-6 w-6 rounded-full object-cover"
                src={toMediaUrl((user as any).photo) || undefined}
                alt={user.username}
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                {user.first_name && user.last_name 
                  ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
                  : user.username.substring(0, 2).toUpperCase()
                }
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-sm font-medium truncate ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.username
              }
            </div>
            <div className={`text-xs truncate ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              @{user.username}
            </div>
          </div>
        </div>
      ))}
      {users.length === 0 && (
        <div className={`text-sm italic ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Sin colaboradores
        </div>
      )}
    </div>
  );

  const columns: ResponsiveTableColumn<Group>[] = [
    {
      key: 'index',
      header: '#',
      accessor: (group) => (group.index ?? 0) + 1,
      className: `text-center text-sm font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`,
      priority: 'high',
      mobileLabel: 'Número'
    },
    {
      key: 'name',
      header: 'Nombre',
      accessor: (group) => (
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {group.name}
          </p>
          {/* Mobile: Show user count below name */}
          <div className={`md:hidden text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {group.users.length} colaborador{group.users.length !== 1 ? 'es' : ''}
          </div>
        </div>
      ),
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Grupo'
    },
    {
      key: 'users',
      header: 'Colaboradores',
      accessor: (group) => renderUsers(group.users),
      className: 'text-left',
      priority: 'medium',
      hideOnMobile: true, // User count shown with name on mobile
      mobileLabel: 'Colaboradores'
    },
    {
      key: 'created_at',
      header: 'Fecha de Creación',
      accessor: (group) => formatDate(group.created_at),
      className: 'text-center',
      priority: 'low',
      mobileLabel: 'Creado'
    },
    {
      key: 'updated_at',
      header: 'Fecha de Actualización',
      accessor: (group) => formatDate(group.updated_at),
      className: 'text-center',
      priority: 'low',
      hideOnMobile: true,
      mobileLabel: 'Actualizado'
    },
    {
      key: 'actions',
      header: 'Acciones',
      accessor: (group) => (
        <EntityActions
          id={group.id}
          onDelete={() => onDeleteClick(group)}
          detailsLabel="Editar"
          onDetails={() => onEditClick(group)}
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
      data={groups.map((group, index) => ({ ...group, index }))}
      columns={columns}
      keyExtractor={(group) => group.id.toString()}
      emptyMessage="No hay grupos disponibles"
    />
  );
};
