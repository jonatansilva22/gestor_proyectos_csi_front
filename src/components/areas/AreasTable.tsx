import { Area } from "../../types/areas/Area";
import borrar from "../../assets/borrar-icon.png";
import { EntityActions } from "../../components/common/EntityActions";

interface AreasTableProps {
  areas: Area[];
  onDeleteClick: (area: Area) => void;
  onEditClick: (area: Area) => void; // Nuevo prop
}

export const AreasTable = ({ areas, onDeleteClick, onEditClick }: AreasTableProps) => (
  <>
    {/* Desktop Table - Hidden on mobile */}
    <div className="hidden lg:block w-full overflow-x-auto max-h-[640px] overflow-y-auto">
      <table className="w-full table-fixed min-w-[700px]">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-center">Fecha de creación</th>
            <th className="px-4 py-2 text-center">Fecha de actualización</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area, idx) => (
            <tr key={area.id} className="border-t">
              <td className="px-4 py-7">{idx + 1}</td>
              <td className="px-4 py-7 text-left">{area.name}</td>
              <td className="px-4 py-7 text-center">{area.created_at ? new Date(area.created_at).toLocaleString() : "dd/mm/yyyy"}</td>
              <td className="px-4 py-7 text-center">{area.updated_at ? new Date(area.updated_at).toLocaleString() : "dd/mm/yyyy"}</td>
              <td>
                <EntityActions
                  onDelete={() => onDeleteClick(area)}
                  detailsLabel="Editar"
                  deleteIcon={borrar}
                  onDetails={() => onEditClick(area)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View - Visible only on mobile */}
    <div className="lg:hidden space-y-4 max-h-[640px] overflow-y-auto">
      {areas.map((area, idx) => (
        <div key={area.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">#{idx + 1}</span>
                <h3 className="font-medium text-gray-900 truncate">
                  {area.name}
                </h3>
              </div>
            </div>
            <div className="flex-shrink-0">
              <EntityActions
                onDelete={() => onDeleteClick(area)}
                detailsLabel="Editar"
                deleteIcon={borrar}
                onDetails={() => onEditClick(area)} 
              />
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 block">Fecha de creación:</span>
              <span className="font-medium">
                {area.created_at ? new Date(area.created_at).toLocaleDateString("es-MX") : "dd/mm/yyyy"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Fecha de actualización:</span>
              <span className="font-medium">
                {area.updated_at ? new Date(area.updated_at).toLocaleDateString("es-MX") : "dd/mm/yyyy"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);