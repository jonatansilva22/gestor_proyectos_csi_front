import { useState } from "react";
import { User } from "../../types/user";
import { Group } from "../../types/groups/Group";

interface GroupFormProps {
  onSubmit: (data: { name: string; user_ids: number[] }) => void;
  onCancel: () => void;
  availableUsers: User[];
  initialData?: Group; // <-- aquí el cambio
}

export const GroupForm = ({
  onSubmit,
  onCancel,
  availableUsers,
  initialData,
}: GroupFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    initialData?.users?.map(u => u.id) || []
  );

  const toggleUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, user_ids: selectedUserIds });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Nombre del Grupo</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

<div>
  <label className="block font-semibold mb-1">Selecciona Colaboradores</label>
  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-2">
    {availableUsers.map(user => (
      <div
        key={user.id}
        className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 transition"
      >
        <div className="text-sm text-gray-700">
          {user.first_name} {user.last_name}
          <span className="block text-xs text-gray-400">@{user.username}</span>
        </div>
        <input
          type="checkbox"
          checked={selectedUserIds.includes(user.id)}
          onChange={() => toggleUser(user.id)}
          className="accent-purple-600 w-4 h-4"
        />
      </div>
    ))}
  </div>
</div>


      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">
          Guardar
        </button>
      </div>
    </form>
  );
};
