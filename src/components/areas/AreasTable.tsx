import { Area } from "../../types/areas/Area";
import { EntityActions } from "../../components/common/EntityActions";
import ResponsiveTable, { ResponsiveTableColumn } from "../common/ResponsiveTable";
import { useTheme } from "../../context/ThemeContext";

interface AreasTableProps {
  areas: Area[];
  onDeleteClick: (area: Area) => void;
  onEditClick: (area: Area) => void;
}

export const AreasTable = ({ areas, onDeleteClick, onEditClick }: AreasTableProps) => {
  const { darkMode } = useTheme();

  // Validar que areas sea un array
  if (!areas || !Array.isArray(areas)) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de áreas disponibles</p>
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

  const columns: ResponsiveTableColumn<Area>[] = [
    {
      key: 'index',
      header: '#',
      accessor: (area) => (area.index ?? 0) + 1,
      className: `text-center text-sm font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`,
      priority: 'high',
      mobileLabel: 'Número'
    },
    {
      key: 'name',
      header: 'Nombre',
      accessor: (area) => (
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {area.name}
          </p>
        </div>
      ),
      className: 'text-left',
      priority: 'high',
      mobileLabel: 'Área'
    },
    {
      key: 'created_at',
      header: 'Fecha de Creación',
      accessor: (area) => formatDate(area.created_at),
      className: 'text-center',
      priority: 'medium',
      mobileLabel: 'Creada'
    },
    {
      key: 'updated_at',
      header: 'Fecha de Actualización',
      accessor: (area) => formatDate(area.updated_at),
      className: 'text-center',
      priority: 'low',
      mobileLabel: 'Actualizada'
    },
    {
      key: 'actions',
      header: 'Acciones',
      accessor: (area) => (
        <EntityActions
          id={area.id}
          onDelete={() => onDeleteClick(area)}
          detailsLabel="Editar"
          onDetails={() => onEditClick(area)}
        />
      ),
      className: 'text-center',
      headerClassName: 'text-center',
      priority: 'high',
      mobileLabel: 'Acciones'
    }
  ];

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <ResponsiveTable
        data={areas.map((area, index) => ({ ...area, index }))}
        columns={columns}
        keyExtractor={(area) => area.id.toString()}
        emptyMessage="No hay áreas disponibles"
      />
    </div>
  );
};
