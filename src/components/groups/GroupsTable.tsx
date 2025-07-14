import { Group } from "../../types/groups/Group";
import borrar from "../../assets/borrar-icon.png";
import { EntityActions } from "../common/EntityActions";

interface GroupsTableProps {
  groups: Group[];
  onDeleteClick: (group: Group) => void;
  onEditClick: (group: Group) => void;
}

export const GroupsTable = ({
  groups,
  onDeleteClick,
  onEditClick,
}: GroupsTableProps) => (
  <div className="w-full overflow-x-auto max-h-[640px] overflow-y-auto">
    <table className="w-full table-fixed min-w-[700px] border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left w-10">#</th>
          <th className="px-4 py-2 text-left w-72">Nombre</th>
          <th className="px-4 py-2 text-left">Colaboradores</th>
          <th className="px-4 py-2 text-left w-40">Fecha de creación</th>
          <th className="px-4 py-2 text-left w-40">Fecha de actualización</th>
          <th className="px-4 py-2 text-left w-44">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group, idx) => (
          <tr key={group.id} className="border-t">
            <td className="px-4 py-7 w-5">{idx + 1}</td>
            <td className="px-4 py-7 w-32">{group.name}</td>
            <td className="px-4 py-4 align-top">
              {group.users.map((user) => (
                <div key={user.id} className="text-sm text-gray-700">
                  {user.first_name} {user.last_name}
                  <span className="block text-xs text-gray-400">
                    @{user.username}
                  </span>
                </div>
              ))}
            </td>
            <td className="px-4 py-7 text-left w-32">
              {group.created_at
                ? new Date(group.created_at).toLocaleString()
                : "dd/mm/yyyy"}
            </td>
            <td className="px-4 py-7 text-left w-32">
              {group.updated_at
                ? new Date(group.updated_at).toLocaleString()
                : "dd/mm/yyyy"}
            </td>
            <td className="text-left w-44">
              <EntityActions
                id={group.id}
                onDelete={() => onDeleteClick(group)}
                detailsLabel="Editar"
                deleteIcon={borrar}
                onDetails={() => onEditClick(group)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
