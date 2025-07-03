import { Area } from "../../types/areas/Area";
import borrar from "../../assets/borrar-icon.png";
import { EntityActions } from "../../components/common/EntityActions";

interface AreasTableProps {
  areas: Area[];
  onDeleteClick: (area: Area) => void;
  onEditClick: (area: Area) => void; // Nuevo prop
}

export const AreasTable = ({ areas, onDeleteClick, onEditClick }: AreasTableProps) => (

    <div className="w-full overflow-x-auto max-h-[640px] overflow-y-auto">
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
                id={area.id}
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
  );