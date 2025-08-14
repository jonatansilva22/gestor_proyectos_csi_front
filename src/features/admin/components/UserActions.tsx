import React from 'react';
import { User } from '../../../types/user';
import DeleteButton from '../../../components/common/DeleteButton';
import { useAuth } from '../../../context/AuthContext';

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  currentUserId?: number;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUserId === user.id;
  const isSuperAdmin = currentUser?.role === 2;
  
  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = () => {
    onDelete(user);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full sm:w-auto">
      {/* Edit Button */}
      <button
        onClick={handleEdit}
        className="w-full sm:w-auto min-w-[120px] px-4 py-3 sm:px-6 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 focus:ring-offset-white dark:focus:ring-purple-400 dark:focus:ring-offset-gray-800"
        aria-label={`Editar usuario ${user.username}`}
        title="Editar usuario"
      >
        <span className="sm:hidden">Editar</span>
        <span className="hidden sm:inline">Editar</span>
      </button>
      
      {/* Delete Button */}
      <div className="w-full sm:w-auto flex justify-center">
        <div title={
          isCurrentUser 
            ? "No puedes eliminar tu propia cuenta"
            : !isSuperAdmin 
            ? "Solo el SuperAdmin puede eliminar usuarios"
            : "Eliminar usuario"
        }>
          <DeleteButton
            onDelete={handleDelete}
            ariaLabel={`Eliminar usuario ${user.username}`}
            size="md"
            disabled={isCurrentUser || !isSuperAdmin}
          />
        </div>
      </div>
      
      {/* Indicators for mobile */}
      {isCurrentUser && (
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 text-center">
          No puedes eliminar tu propia cuenta
        </div>
      )}
      {!isCurrentUser && !isSuperAdmin && (
        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 text-center">
          Solo el SuperAdmin puede eliminar usuarios
        </div>
      )}
    </div>
  );
};

export default UserActions;