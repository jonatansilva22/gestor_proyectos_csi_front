import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface SidebarMenuProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar?: () => void;
  username: string;
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
}

const SidebarMenu = ({ 
  isOpen, 
  toggleSidebar, 
  closeSidebar,
  username, 
  isMobile = false, 
  isTablet = false, 
  isDesktop = false 
}: SidebarMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { darkMode } = useTheme();

  // Check user roles
  const isAdminOrSuperAdmin = user?.role === 1 || user?.role === 2;
  const isCollaborator = user?.role === 3;

  const menuItems = [
    // Dashboard solo para Admin y SuperAdmin
    ...(isAdminOrSuperAdmin ? [
      { label: "Dashboard", path: "/dashboard", icon: "📊" }
    ] : []),
    
    // Proyectos para todos los usuarios - Colaboradores van a vista de cards, Admin/SuperAdmin a tabla
    { label: "Proyectos", path: isCollaborator ? "/projects" : "/projects-table", icon: "📁" },
    
    // Funciones administrativas solo para Admin y SuperAdmin
    ...(isAdminOrSuperAdmin ? [
      { label: "Crear Usuario", path: "/create-user", icon: "👤" },
      { label: "Gestión de Usuarios", path: "/admin/users", icon: "⚙️" },
      { label: "Áreas", path: "/areas-table", icon: "🏢" },
      { label: "Repositorios", path: "/repositories-table", icon: "📚" },
      { label: "Herramientas", path: "/tools-table", icon: "🔧" },
      { label: "Grupos", path: "/groups-table", icon: "👥" },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    // Haptic feedback for mobile navigation
    if ((isMobile || isTablet) && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    navigate(path);
    // Always close sidebar on mobile/tablet after navigation
    if (isMobile || isTablet) {
      if (closeSidebar) {
        closeSidebar();
      } else {
        toggleSidebar();
      }
    }
  };

  // Determine z-index and positioning based on device type
  const sidebarClasses = `
    ${isDesktop 
      ? 'fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-20' 
      : 'fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out z-40'
    }
    w-64 shadow-lg flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    ${darkMode 
      ? 'bg-[#3A2B5A] shadow-purple-900/30' 
      : 'bg-white shadow-purple-300/50'
    }
  `;

  return (
    <nav className={sidebarClasses}>
      {/* Header */}
      <div className={`text-white h-14 sm:h-16 flex items-center px-4 sm:px-6 bg-primary-600`}>
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold text-base sm:text-lg truncate">
            Hola, {username}
          </span>
          {/* Close button for mobile */}
          {(isMobile || isTablet) && (
            <button
              onClick={() => {
                // Haptic feedback
                if ('vibrate' in navigator) {
                  navigator.vibrate(30);
                }
                if (closeSidebar) {
                  closeSidebar();
                } else {
                  toggleSidebar();
                }
              }}
              className="p-2 rounded-md hover:bg-white/10 transition-colors touch-manipulation"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <ul className="list-none p-0 m-0 flex-grow overflow-auto">
        {menuItems.map((item) => (
          <li
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`
              px-4 sm:px-6 py-4 cursor-pointer transition-all duration-200
              flex items-center gap-3 touch-manipulation
              min-h-[48px]
              ${darkMode 
                ? 'border-b border-purple-700/30' 
                : 'border-b border-gray-200'
              }
              ${
                isActive(item.path)
                  ? "bg-primary-600 text-white font-semibold shadow-md"
                  : darkMode
                    ? "text-purple-200 hover:bg-purple-700/20 active:bg-purple-600/30 focus:bg-purple-600/20"
                    : "text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100"
              }
            `}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigation(item.path);
              }
            }}
          >
            <span className="text-lg flex-shrink-0" aria-hidden="true">{item.icon}</span>
            <span className={`
              text-sm sm:text-base flex-1 text-left
              ${isActive(item.path) ? 'font-semibold' : 'font-medium'}
            `}>
              {item.label}
            </span>
            {/* Visual indicator for active item */}
            {isActive(item.path) && (
              <span className="w-2 h-2 bg-white rounded-full flex-shrink-0" aria-hidden="true" />
            )}
          </li>
        ))}

        {/* Logout moved to UserMenu button (navega a /logout) */}
      </ul>

      {/* Footer - Only show on desktop */}
      {isDesktop && (
        <div className={`
          px-4 py-3 border-t text-center text-xs
          ${darkMode 
            ? 'border-purple-700/30 text-purple-300' 
            : 'border-gray-200 text-gray-500'
          }
        `}>
          CSI Project Manager
        </div>
      )}
    </nav>
  );
};

export default SidebarMenu;
