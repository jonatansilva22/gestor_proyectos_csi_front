// src/components/permissions/BulkActionsToolbar.tsx
import React from "react";
import { UserPermissions } from "../../types/auth";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onUpdatePermissions: (permissions: Partial<UserPermissions>) => void;
  onDelete: () => void;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onUpdatePermissions,
  onDelete,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
      <p className="text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? "usuario seleccionado" : "usuarios seleccionados"}
      </p>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onUpdatePermissions({ canWrite: true, canRead: true })}
          className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Hacer Editor
        </button>
        <button
          onClick={() => onUpdatePermissions({ canWrite: false, canRead: true })}
          className="px-3 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
        >
          Hacer Lector
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};