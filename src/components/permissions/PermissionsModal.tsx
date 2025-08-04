// src/components/permissions/PermissionsModal.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { User } from "../../types/permissions";
import { UserPermissions } from "../../types/auth";

interface PermissionsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (permissions: UserPermissions) => void;
  user: User | null;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  open,
  onClose,
  onSave,
  user,
}) => {
  const [permissions, setPermissions] = useState<UserPermissions>({
    modelPermissions: [],
    objectPermissions: [],
    canRead: false,
    canWrite: false,
    canDelete: false,
    canManageProjects: false,
    canManageUsers: false,
    canViewReports: false,
    canExport: false,
    canManagePermissions: false
  });

  useEffect(() => {
    if (user) {
      // This component might need to be refactored to work with backend permissions
      // For now, use default permissions
      setPermissions({
        modelPermissions: [],
        objectPermissions: [],
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManageProjects: false,
        canManageUsers: false,
        canViewReports: false,
        canExport: false,
        canManagePermissions: false
      });
    }
  }, [user]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPermissions((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateName = e.target.value;
    if (templateName === 'readonly') {
      setPermissions({
        modelPermissions: [],
        objectPermissions: [],
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManageProjects: false,
        canManageUsers: false,
        canViewReports: false,
        canExport: false,
        canManagePermissions: false
      });
    } else if (templateName === 'editor') {
      setPermissions({
        modelPermissions: [],
        objectPermissions: [],
        canRead: true,
        canWrite: true,
        canDelete: false,
        canManageProjects: false,
        canManageUsers: false,
        canViewReports: true,
        canExport: true,
        canManagePermissions: false
      });
    } else if (templateName === 'admin') {
      setPermissions({
        modelPermissions: [],
        objectPermissions: [],
        canRead: true,
        canWrite: true,
        canDelete: true,
        canManageProjects: true,
        canManageUsers: true,
        canViewReports: true,
        canExport: true,
        canManagePermissions: true
      });
    }
  };

  const handleSave = () => {
    onSave(permissions);
    onClose();
  };

  return (
    <Modal
      title={`Editando permisos de ${user?.name}`}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plantilla de permisos
          </label>
          <select
            onChange={handleTemplateChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar plantilla</option>
            <option value="readonly">Solo Lectura</option>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {['canRead', 'canWrite', 'canDelete', 'canManageProjects', 'canManageUsers', 'canViewReports', 'canExport', 'canManagePermissions'].map((key) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                name={key}
                checked={permissions[key as keyof UserPermissions] as boolean}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{key}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end pt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </Modal>
  );
};
