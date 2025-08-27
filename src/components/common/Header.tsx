import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useMobileNavigation } from "../../hooks/useMobileNavigation";
import logo from "../../assets/logo-csi.png";
import menu from "../../assets/menu.png";
import UserMenu from "../../components/common/UserMenu";
import UserAvatar from "./UserAvatar";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showMenuButton?: boolean;
}

const Header = ({ 
  title, 
  onMenuClick, 
  isMobile = false, 
  isSidebarOpen = false,
  showBackButton,
  onBackClick,
  showMenuButton = true
}: HeaderProps) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const { canGoBack, goBack } = useMobileNavigation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Determine if we should show back button
  const shouldShowBackButton = showBackButton || (isMobile && canGoBack);
  
  // Handle back button click
  const handleBackClick = () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    if (onBackClick) {
      onBackClick();
    } else {
      goBack();
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };


  return (
    <header className="w-full flex items-center h-14 sm:h-16 px-3 sm:px-6 shadow-lg z-20 bg-primary-600 shadow-primary-900/30">
      <div className="flex items-center gap-2">
        {/* Back Button - Show on mobile when navigation history exists */}
        {shouldShowBackButton && (
          <button
            onClick={handleBackClick}
            aria-label="Volver"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 touch-manipulation ${
              darkMode
                ? 'hover:bg-primary-700 focus:ring-primary-400'
                : 'hover:bg-primary-700 focus:ring-primary-300'
            }`}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Menu Button - oculto si no hay sidebar */}
        {showMenuButton && (
        <button
            onClick={() => {
              // Haptic feedback
              if (isMobile && 'vibrate' in navigator) {
                navigator.vibrate(30);
              }
              onMenuClick();
            }}
            aria-label="Abrir menú"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 touch-manipulation ${
              darkMode
                ? 'hover:bg-primary-700 focus:ring-primary-400'
                : 'hover:bg-primary-700 focus:ring-primary-300'
            }`}
          >
            {/* Hamburger icon for mobile, regular menu icon for desktop */}
            {isMobile ? (
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-white transform transition-transform duration-300 ${
                  isSidebarOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                }`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${
                  isSidebarOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`block w-5 h-0.5 bg-white transform transition-transform duration-300 ${
                  isSidebarOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                }`}></span>
              </div>
            ) : (
              <img src={menu} alt="Menú" className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Logo and Title */}
      <div className="flex items-center ml-3 sm:ml-4 flex-1 min-w-0">
        <img src={logo} alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" />
        <span className="text-white text-lg sm:text-xl font-semibold truncate">
          {title}
        </span>
      </div>

      {/* User Menu - Responsive design */}
      <div className="relative flex-shrink-0">
        <button
          ref={userButtonRef}
          onClick={() => {
            // Haptic feedback for mobile
            if (isMobile && 'vibrate' in navigator) {
              navigator.vibrate(20);
            }
            toggleUserMenu();
          }}
          className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 touch-manipulation cursor-pointer ${
            darkMode
              ? 'hover:bg-primary-700 focus:ring-primary-400'
              : 'hover:bg-primary-700 focus:ring-primary-300'
          }`}
          aria-label="Menú de usuario"
        >
          {/* Avatar */}
          {user && (
            <UserAvatar
              user={{
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                photo: user.photo
              }}
              size="small"
              className={`border-2 ${darkMode ? 'border-white/30' : 'border-white/20'}`}
            />
          )}
          
          {/* Username - Hidden on mobile to save space */}
          <div className="hidden sm:block max-w-24 lg:max-w-none">
            <div className="text-white text-sm font-medium truncate">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : (user?.username || 'Usuario')
              }
            </div>
            <div className="text-white/70 text-xs truncate">
              @{user?.username || 'user'}
            </div>
          </div>
          
          {/* Dropdown Arrow - Smaller on mobile */}
          <svg 
            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${
              darkMode ? 'text-white/80' : 'text-white/70'
            }`}
            style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <UserMenu
          isOpen={isUserMenuOpen}
          onClose={closeUserMenu}
          triggerRef={userButtonRef}
        />
      </div>
    </header>
  );
};

export default Header;
