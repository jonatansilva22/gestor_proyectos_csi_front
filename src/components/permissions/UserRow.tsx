import React from "react";
import {
  User,
  USER_STATUS_LABELS,
} from "../../types/permissions";
import { UserPermissionResponse } from "../../types/backend-permissions";
import { useTheme } from "../../context/ThemeContext";

interface UserRowProps {
  user: User & { backendPermissions?: UserPermissionResponse };
  onPermissionsClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
  isSelected?: boolean;
  onSelect?: (isSelected: boolean) => void;
}

// Helper function to process and summarize backend permissions
const summarizePermissions = (backendPermissions?: UserPermissionResponse) => {
  if (!backendPermissions || (!backendPermissions.model_permissions.length && !backendPermissions.object_permissions.length)) {
    return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Sin permisos</span>;
  }

  const permissionsByModel: { [key: string]: string[] } = {};

  backendPermissions.model_permissions.forEach(p => {
    const modelName = p.content_type.model;
    if (!permissionsByModel[modelName]) {
      permissionsByModel[modelName] = [];
    }
    permissionsByModel[modelName].push(p.permission.codename);
  });

  const summary = Object.entries(permissionsByModel).map(([model, perms]) => {
    const permCount = perms.length;
    return `${model} (${permCount})`;
  });

  if (summary.length === 0) {
    return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Permisos de objeto</span>;
  }

  return summary.slice(0, 2).map(s => (
    <span key={s} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
      {s}
    </span>
  ));
};

export const UserRow: React.FC<UserRowProps> = ({
  user,
  onPermissionsClick,
  onDeleteClick,
  isSelected = false,
  onSelect,
}) => {
  const { darkMode } = useTheme();


  const getStatusLabel = (status: string) => {
    return (
      USER_STATUS_LABELS[status as keyof typeof USER_STATUS_LABELS] ||
      status
    );
  };
  
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'no_project':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <>
      <div
        className={`grid grid-cols-12 gap-6 items-center py-4 px-8 transition-colors duration-200 ${
          isSelected 
            ? darkMode ? 'bg-purple-800/50' : 'bg-purple-100'
            : darkMode ? "hover:bg-purple-800" : "hover:bg-purple-50"
        }`}
      >
        {/* Checkbox - Columna fija */}
        <div className="col-span-1 flex justify-center">
          {onSelect ? (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
          ) : (
            <div className="w-4 h-4"></div>
          )}
        </div>

        {/* Nombre y Permisos - Columna principal */}
        <div className="col-span-4 flex items-center space-x-3 min-w-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 29 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`flex-shrink-0 ${darkMode ? "text-white" : "text-black"}`}
          >
            <g clipPath="url(#clip0_388_483)">
              <path
                d="M14.5 13.5C16.6975 13.5 18.805 12.7888 20.3589 11.523C21.9128 10.2571 22.7857 8.54021 22.7857 6.75C22.7857 4.95979 21.9128 3.2429 20.3589 1.97703C18.805 0.711159 16.6975 0 14.5 0C12.3025 0 10.195 0.711159 8.64111 1.97703C7.08724 3.2429 6.21429 4.95979 6.21429 6.75C6.21429 8.54021 7.08724 10.2571 8.64111 11.523C10.195 12.7888 12.3025 13.5 14.5 13.5ZM11.5417 16.0312C5.16563 16.0312 0 20.2395 0 25.4338C0 26.2986 0.860938 27 1.92254 27H27.0775C28.1391 27 29 26.2986 29 25.4338C29 20.2395 23.8344 16.0312 17.4583 16.0312H11.5417Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_388_483">
                <rect width="29" height="27" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <div className="flex flex-col min-w-0 flex-1">
            <span
              className={`font-inter text-sm font-bold truncate ${darkMode ? "text-white" : "text-black"}`}
              title={user.name}
            >
              {user.name}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {summarizePermissions(user.backendPermissions)}
            </div>
          </div>
        </div>

        {/* Estado - Columna fija */}
        <div className="col-span-2 flex justify-center">
          <span
            className={`font-inter text-sm font-medium px-3 py-1 rounded-full ${getStatusBadgeStyle(user.status)}`}
            title={getStatusLabel(user.status)}
          >
            {getStatusLabel(user.status)}
          </span>
        </div>

        {/* Email - Columna con ancho ajustado */}
        <div className="col-span-2 flex justify-start">
          <span
            className={`font-inter text-sm font-normal truncate ${darkMode ? "text-white" : "text-black"}`}
            title={user.email}
          >
            {user.email}
          </span>
        </div>

        {/* Acciones */}
        <div className="col-span-3 flex items-center justify-end space-x-3 pr-4">
          {/* Botón de Permisos */}
          <button
            onClick={() => onPermissionsClick(user)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 rounded-md text-sm font-medium"
            title="Configurar permisos del usuario"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                fill="currentColor"
              />
            </svg>
            <span>Permisos</span>
          </button>

          {/* Botón de Eliminar */}
          <button
            onClick={() => onDeleteClick(user)}
            className="w-9 h-9 bg-red-500 hover:bg-red-600 transition-colors duration-200 rounded-full flex items-center justify-center"
            aria-label={`Eliminar ${user.name}`}
            title={`Eliminar ${user.name}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M2.5 5H4.16667H17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66699 5V3.33333C6.66699 2.89131 6.84259 2.46738 7.15516 2.15482C7.46772 1.84226 7.89164 1.66667 8.33366 1.66667H11.667C12.109 1.66667 12.5329 1.84226 12.8455 2.15482C13.1581 2.46738 13.3337 2.89131 13.3337 3.33333V5M15.8337 5V16.6667C15.8337 17.1087 15.6581 17.5326 15.3455 17.8452C15.0329 18.1577 14.609 18.3333 14.167 18.3333H5.83366C5.39164 18.3333 4.96772 18.1577 4.65516 17.8452C4.34259 17.5326 4.16699 17.1087 4.16699 16.6667V5H15.8337Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.33301 9.16667V14.1667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.667 9.16667V14.1667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>


    </>
  );
};
