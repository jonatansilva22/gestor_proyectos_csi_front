// src/components/tools/ToolsTable.tsx
import { Tool } from "../../types/tools/Tool";
import borrar from "../../assets/borrar-icon.png";
import { EntityActions } from "../common/EntityActions";
import placeholder from "../../assets/placeholder.png";

interface ToolsTableProps {
  tools: Tool[];
  onDeleteClick: (tool: Tool) => void;
  onEditClick: (tool: Tool) => void;
}

export const ToolsTable = ({ tools, onDeleteClick, onEditClick }: ToolsTableProps) => (
<table className="w-full table-fixed min-w-[700px] border-collapse">
<thead>
  <tr>
    <th className="px-4 py-2 text-left w-10">#</th>
    <th className="px-4 py-2 text-left w-[300px]">Nombre</th>
    <th className="px-4 py-2 text-left w-40">Imagen</th>
    <th className="px-4 py-2 text-left w-40">Fecha de Creación</th>
    <th className="px-4 py-2 text-left w-40">Fecha de Actualización</th>
    <th className="px-4 py-2 text-center w-32">Acciones</th>
  </tr>
</thead>
  <tbody>
    {tools.map((tool, idx) => (
      <tr key={tool.id} className="border-t">
        <td className="px-4 py-4 w-10">{idx + 1}</td>
        <td className="px-4 py-4 w-[300px]">{tool.name}</td>
<td className="w-40 py-4 text-center">
  <div className="w-24 h-20 flex items-center justify-center bg-gray-200 rounded-lg">
    <img
      src={tool.image || placeholder}
      alt={tool.name}
      className="object-contain w-16 h-16"
    />
  </div>
</td>
<td className="px-4 py-2 text-sm text-gray-700">{new Date(tool.created_at).toLocaleString()}</td>
<td className="px-4 py-2 text-sm text-gray-700">{new Date(tool.updated_at).toLocaleString()}</td>
        <td className="text-center w-32 py-4">
          <EntityActions
            onDelete={() => onDeleteClick(tool)}
            detailsLabel="Editar"
            deleteIcon={borrar}
            onDetails={() => onEditClick(tool)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

);
