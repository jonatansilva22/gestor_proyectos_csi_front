import { Project } from "../../types/projects/Project";
import { ProjectActions } from "./ProjectActions";
import ResponsiveTable, { ResponsiveTableColumn } from "../common/ResponsiveTable";
import placeholder from "../../assets/placeholder.png";
import { PROJECT_STATUS_COLORS_TEXT } from "../../const/projectsStatusColors";
import { useTheme } from "../../context/ThemeContext";

interface ProjectsTableProps {
  projects: Project[];
  onDeleteClick: (project: Project) => void;
}

export const ProjectsTable = ({ projects, onDeleteClick }: ProjectsTableProps) => {
  const { darkMode } = useTheme();
  // Validar que projects sea un array
  if (!projects || !Array.isArray(projects)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de proyectos disponibles</p>
      </div>
    );
  }
  const columns: ResponsiveTableColumn<Project>[] = [
    {
      key: 'index',
      header: '#',
      accessor: (project) => (project.index ?? 0) + 1,
      className: `text-center text-sm font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`,
      priority: 'high',
      mobileLabel: 'Número'
    },
    {
      key: 'image',
      header: 'Imagen',
      accessor: (project) => (
        <div className="w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto">
          <img
            src={project.image || placeholder}
            alt="Proyecto"
            className="object-contain w-12 h-10 sm:w-14 sm:h-12 md:w-16 md:h-16 rounded"
          />
        </div>
      ),
      className: 'text-center',
      priority: 'medium',
      hideOnMobile: true
    },
    {
      key: 'name',
      header: 'Nombre del Proyecto',
      accessor: (project) => (
        <div className="flex items-center space-x-3">
          {/* Mobile: Show image inline with name */}
          <div className="w-10 h-8 md:hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0">
            <img
              src={project.image || placeholder}
              alt="Proyecto"
              className="object-contain w-8 h-6 rounded"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {project.name}
            </p>
            {/* Mobile: Show status below name */}
            <div className="md:hidden mt-1">
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  PROJECT_STATUS_COLORS_TEXT[project.status?.name || ''] || 'text-gray-700'
                } ${
                  project.status?.name === 'Activo' ? 'bg-green-100' :
                  project.status?.name === 'Inactivo' ? 'bg-yellow-100' :
                  project.status?.name === 'Completado' ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                {project.status?.name || 'Sin estado'}
              </span>
            </div>
          </div>
        </div>
      ),
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Proyecto'
    },
    {
      key: 'status',
      header: 'Estado',
      accessor: (project) => {
        const statusName = project.status?.name || '';
        const getBgColor = (status: string) => {
          if (darkMode) {
            switch (status) {
              case 'Activo': return 'bg-green-900/30';
              case 'Inactivo': return 'bg-yellow-900/30';
              case 'Completado': return 'bg-blue-900/30';
              default: return 'bg-gray-700/30';
            }
          }
          switch (status) {
            case 'Activo': return 'bg-green-100';
            case 'Inactivo': return 'bg-yellow-100';
            case 'Completado': return 'bg-blue-100';
            default: return 'bg-gray-100';
          }
        };
        const getTextColor = (status: string) => {
          return PROJECT_STATUS_COLORS_TEXT[status] || (darkMode ? 'text-gray-300' : 'text-gray-700');
        };

        return (
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getTextColor(statusName)} ${getBgColor(statusName)}`}
          >
            {statusName || 'Sin estado'}
          </span>
        );
      },
      className: 'text-left',
      priority: 'high',
      hideOnMobile: true // Shown inline with name on mobile
    },
    {
      key: 'start_date',
      header: 'Fecha Inicio',
      accessor: (project) => {
        const date = new Date(project.start_date);
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
      },
      className: 'text-left',
      priority: 'medium',
      mobileLabel: 'Inicio'
    },
    {
      key: 'end_date',
      header: 'Fecha Final',
      accessor: (project) => {
        const date = new Date(project.end_date);
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
      },
      className: 'text-left',
      priority: 'low',
      mobileLabel: 'Fin'
    },
    {
      key: 'actions',
      header: 'Acciones',
      accessor: (project) => (
        <ProjectActions
          projectId={project.id}
          onDelete={() => onDeleteClick(project)}
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
      data={projects.map((project, index) => ({ ...project, index }))}
      columns={columns}
      keyExtractor={(project) => project.id.toString()}
      emptyMessage="No hay proyectos disponibles"
    />
  );
};
