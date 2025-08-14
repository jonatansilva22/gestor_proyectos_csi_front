import { Tool } from "../../types/tools/Tool";
import { EntityActions } from "../common/EntityActions";
import placeholder from "../../assets/placeholder.png";
import ResponsiveTable, { ResponsiveTableColumn } from "../common/ResponsiveTable";
import { useTheme } from "../../context/ThemeContext";

interface ToolsTableProps {
  tools: Tool[];
  onDeleteClick: (tool: Tool) => void;
  onEditClick: (tool: Tool) => void;
}

export const ToolsTable = ({ tools, onDeleteClick, onEditClick }: ToolsTableProps) => {
  const { darkMode } = useTheme();
  // Validar que tools sea un array
  if (!tools || !Array.isArray(tools)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de herramientas disponibles</p>
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

  const columns: ResponsiveTableColumn<Tool>[] = [
    {
      key: 'index',
      header: '#',
      accessor: (tool) => (tool.index ?? 0) + 1,
      className: `text-center text-sm font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`,
      priority: 'high',
      mobileLabel: 'Número'
    },
    {
      key: 'name',
      header: 'Nombre',
      accessor: (tool) => (
        <div className="flex items-center space-x-3">
          {/* Mobile: Show image inline with name */}
          <div className="w-12 h-10 md:hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
            <img
              src={tool.image || placeholder}
              alt={tool.name}
              className="object-contain w-8 h-8 rounded"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {tool.name}
            </p>
          </div>
        </div>
      ),
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Herramienta'
    },
    {
      key: 'image',
      header: 'Imagen',
      accessor: (tool) => (
        <div className="w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto">
          <img
            src={tool.image || placeholder}
            alt={tool.name}
            className="object-contain w-12 h-10 sm:w-14 sm:h-12 md:w-16 md:h-16 rounded"
          />
        </div>
      ),
      className: 'text-center',
      priority: 'medium',
      hideOnMobile: true // Shown inline with name on mobile
    },
    {
      key: 'created_at',
      header: 'Fecha de Creación',
      accessor: (tool) => formatDate(tool.created_at),
      className: 'text-center',
      priority: 'medium',
      mobileLabel: 'Creada'
    },
    {
      key: 'updated_at',
      header: 'Fecha de Actualización',
      accessor: (tool) => formatDate(tool.updated_at),
      className: 'text-center',
      priority: 'low',
      mobileLabel: 'Actualizada'
    },
    {
      key: 'actions',
      header: 'Acciones',
      accessor: (tool) => (
        <EntityActions
          id={tool.id}
          onDelete={() => onDeleteClick(tool)}
          detailsLabel="Editar"
          onDetails={() => onEditClick(tool)}
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
      data={tools.map((tool, index) => ({ ...tool, index }))}
      columns={columns}
      keyExtractor={(tool) => tool.id.toString()}
      emptyMessage="No hay herramientas disponibles"
    />
  );
};
