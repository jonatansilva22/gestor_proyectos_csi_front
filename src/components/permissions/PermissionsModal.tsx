// src/components/permissions/PermissionsModal.tsx
import React, { useState, useEffect } from "react";
import {
  Student,
  StudentPermissions,
  PERMISSION_TEMPLATES,
} from "../../types/permissions";
import { useTheme } from "../../context/ThemeContext";

interface PermissionsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentId: number, permissions: StudentPermissions) => Promise<void>;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  const { darkMode } = useTheme();
  const [permissions, setPermissions] = useState<StudentPermissions>({
    canRead: false,
    canWrite: false,
    canDelete: false,
    canManageProjects: false,
    canViewReports: false,
    canExport: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setPermissions(student.permissions);
    }
  }, [student]);

  const handlePermissionChange = (permission: keyof StudentPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const applyTemplate = (templateName: keyof typeof PERMISSION_TEMPLATES) => {
    setPermissions(PERMISSION_TEMPLATES[templateName]);
  };

  const handleSave = async () => {
    if (!student) return;

    setLoading(true);
    try {
      await onSave(student.id, permissions);
      onClose();
    } catch (error) {
      console.error("Error saving permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-md mx-4 rounded-lg shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <h3
              className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Permisos para {student.name}
            </h3>
            <button
              onClick={onClose}
              className={`text-gray-400 hover:text-gray-600 ${darkMode ? "hover:text-gray-300" : ""}`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Template Buttons */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Plantillas rápidas:
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => applyTemplate("readonly")}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                Solo lectura
              </button>
              <button
                onClick={() => applyTemplate("editor")}
                className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
              >
                Editor
              </button>
              <button
                onClick={() => applyTemplate("admin")}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
              >
                Administrador
              </button>
            </div>
          </div>

          {/* Permission Checkboxes */}
          <div className="space-y-3">
            {Object.entries(permissions).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() =>
                    handlePermissionChange(key as keyof StudentPermissions)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {getPermissionLabel(key)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} flex justify-end space-x-3`}
        >
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getPermissionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    canRead: "Puede leer",
    canWrite: "Puede escribir",
    canDelete: "Puede eliminar",
    canManageProjects: "Puede gestionar proyectos",
    canViewReports: "Puede ver reportes",
    canExport: "Puede exportar",
  };
  return labels[key] || key;
};
