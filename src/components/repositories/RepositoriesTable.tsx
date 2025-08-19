import { Repository } from "../../types/repositories/Repository";
import { EntityActions } from "../common/EntityActions";
import ResponsiveTable, { ResponsiveTableColumn } from "../common/ResponsiveTable";
import { useTheme } from "../../context/ThemeContext";

interface RepositoriesTableProps {
  repositories: Repository[];
  onDeleteClick: (repository: Repository) => void;
  onEditClick: (repository: Repository) => void;
}

export const RepositoriesTable = ({
  repositories,
  onDeleteClick,
  onEditClick,
}: RepositoriesTableProps) => {
  const { darkMode } = useTheme();
  // Validar que repositories sea un array
  if (!repositories || !Array.isArray(repositories)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de repositorios disponibles</p>
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

  const formatUrl = (url: string) => {
    const maxLength = 50;
    const displayUrl = url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
    
    return (
      <div className="max-w-xs">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-words text-sm"
          title={url}
        >
          {displayUrl}
        </a>
      </div>
    );
  };

  const columns: ResponsiveTableColumn<Repository>[] = [
    {
      key: 'index',
      header: '#',
      accessor: (repo) => (repo.index ?? 0) + 1,
      className: `text-center text-sm font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`,
      priority: 'high',
      mobileLabel: 'Número'
    },
    {
      key: 'name',
      header: 'Nombre',
      accessor: (repo) => (
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {repo.name}
          </p>
          {/* Mobile: Show project below name */}
          <div className={`md:hidden text-xs mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Proyecto: {repo.project}
          </div>
        </div>
      ),
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Repositorio'
    },
    {
      key: 'repository_url',
      header: 'URL del Repositorio',
      accessor: (repo) => formatUrl(repo.repository_url),
      className: 'text-left',
      priority: 'medium',
      mobileLabel: 'URL'
    },
    
    {
      key: 'created_at',
      header: 'Fecha de Creación',
      accessor: (repo) => formatDate(repo.created_at),
      className: 'text-center',
      priority: 'low',
      mobileLabel: 'Creado'
    },
    {
      key: 'updated_at',
      header: 'Fecha de Actualización',
      accessor: (repo) => formatDate(repo.updated_at),
      className: 'text-center',
      priority: 'low',
      hideOnMobile: true,
      mobileLabel: 'Actualizado'
    },
    {
      key: 'actions',
      header: 'Acciones',
      accessor: (repo) => (
        <EntityActions
          id={repo.id}
          onDelete={() => onDeleteClick(repo)}
          detailsLabel="Editar"
          onDetails={() => onEditClick(repo)}
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
      data={repositories.map((repo, index) => ({ ...repo, index }))}
      columns={columns}
      keyExtractor={(repo) => repo.id.toString()}
      emptyMessage="No hay repositorios disponibles"
    />
  );
};
