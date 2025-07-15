import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarMenuProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  username: string;
}

const SidebarMenu = ({ isOpen, toggleSidebar, username }: SidebarMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Proyectos", path: "/projects-table" },
    { label: "Crear Usuario", path: "/create-user" },
    { label: "Permisos", path: "/permissions" },
    { label: "Áreas", path: "/areas-table" },
    { label: "Repositorios", path: "/repositories-table" },
    { label: "Herramientas", path: "/tools-table" },
    { label: "Grupos", path: "/groups-table" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg
          transition-transform duration-300 ease-in-out z-50 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="bg-purple-700 text-white h-14 flex items-center px-6">
          <span className="font-semibold text-lg">Hola, {username}</span>
        </div>

        <ul className="list-none p-0 m-0 flex-grow overflow-auto">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                px-6 py-3 cursor-pointer border-b border-gray-300 transition
                ${
                  isActive(item.path)
                    ? "bg-purple-700 text-white font-semibold"
                    : "text-gray-500 hover:bg-purple-100"
                }
              `}
            >
              {item.label}
            </li>
          ))}

          <li
            onClick={() => handleNavigation("/logout")}
            className="px-6 py-3 mt-5  cursor-pointer text-red-600 hover:text-red-700"
          >
            Cerrar Sesión
          </li>
        </ul>
      </nav>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    </>
  );
};

export default SidebarMenu;
