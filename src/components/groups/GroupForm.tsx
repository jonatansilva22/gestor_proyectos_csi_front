import { useState } from "react";
import { User } from "../../types/user";
import { Group } from "../../types/groups/Group";
import { useTheme } from "../../context/ThemeContext";
import UserAvatar from "../common/UserAvatar";

interface GroupFormProps {
  onSubmit: (data: { name: string; user_ids: number[] }) => void;
  onCancel: () => void;
  availableUsers: User[];
  initialData?: Group;
}

export const GroupForm = ({
  onSubmit,
  onCancel,
  availableUsers,
  initialData,
}: GroupFormProps) => {
  const { darkMode } = useTheme();
  const [name, setName] = useState(initialData?.name || "");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>(
    initialData?.users?.map(u => u.id) || []
  );
  const [searchTerm, setSearchTerm] = useState(""); // <-- estado de búsqueda

  const toggleUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, user_ids: selectedUserIds });
  };

  // Filtrar usuarios según búsqueda
  const filteredUsers = availableUsers.filter(user =>
    `${user.first_name} ${user.last_name} ${user.username}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block font-semibold mb-1 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Nombre del Grupo</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={`w-full border rounded px-3 py-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
      </div>

      <div>
        <label className={`block font-semibold mb-1 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Selecciona Colaboradores</label>
        
        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`w-full border rounded px-3 py-2 mb-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />

        {/* Lista filtrada */}
        <div className={`flex flex-col gap-2 max-h-60 overflow-y-auto border rounded p-2 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`flex items-center justify-between px-3 py-2 rounded transition ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <UserAvatar 
                    user={user} 
                    size="small"
                  />
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {user.first_name} {user.last_name}
                    <span className={`block text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>@{user.username}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  className="accent-purple-600 w-4 h-4"
                />
              </div>
            ))
          ) : (
            <p className={`text-sm italic ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>No se encontraron usuarios</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded cursor-pointer ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
          }`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};
