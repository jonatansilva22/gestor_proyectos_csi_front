// src/components/navigation/MobileNavigationShortcuts.tsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useMobileNavigation } from '../../hooks/useMobileNavigation';

interface MobileNavigationShortcutsProps {
  className?: string;
  position?: 'bottom' | 'top' | 'floating';
  maxShortcuts?: number;
}

const MobileNavigationShortcuts: React.FC<MobileNavigationShortcutsProps> = ({
  className = '',
  position = 'bottom',
  maxShortcuts = 4,
}) => {
  const { darkMode } = useTheme();
  const { 
    getContextualShortcuts, 
    navigateToPath, 
    isMobile, 
    currentPage,
    navigationHistory 
  } = useMobileNavigation();
  
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const shortcuts = getContextualShortcuts().slice(0, maxShortcuts);
  const recentPages = navigationHistory
    .slice(-4) // Last 4 pages
    .filter(page => page.path !== currentPage?.path) // Exclude current page
    .reverse(); // Most recent first

  const positionClasses = {
    bottom: 'fixed bottom-4 left-4 right-4 z-50',
    top: 'fixed top-20 left-4 right-4 z-40',
    floating: 'fixed bottom-20 right-4 z-50',
  };

  const handleShortcutClick = (path: string) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    navigateToPath(path);
  };

  const toggleExpanded = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    setIsExpanded(!isExpanded);
  };

  if (position === 'floating') {
    return (
      <div className={`${positionClasses[position]} ${className}`}>
        {/* Floating Action Button */}
        <div className="flex flex-col items-end gap-2">
          {/* Expanded shortcuts */}
          {isExpanded && (
            <div className="flex flex-col gap-2 mb-2">
              {shortcuts.map((shortcut) => (
                <button
                  key={shortcut.path}
                  onClick={() => handleShortcutClick(shortcut.path)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-full shadow-lg
                    transition-all duration-200 transform hover:scale-105
                    ${darkMode
                      ? 'bg-purple-700 text-white hover:bg-purple-600'
                      : 'bg-white text-purple-700 hover:bg-purple-50'
                    }
                  `}
                  title={shortcut.title}
                >
                  <span className="text-sm">{shortcut.icon}</span>
                  <span className="text-xs font-medium max-w-20 truncate">
                    {shortcut.title}
                  </span>
                </button>
              ))}
            </div>
          )}
          
          {/* Main FAB */}
          <button
            onClick={toggleExpanded}
            className={`
              w-12 h-12 rounded-full shadow-lg transition-all duration-200
              flex items-center justify-center transform hover:scale-105
              ${darkMode
                ? 'bg-purple-600 text-white hover:bg-purple-500'
                : 'bg-purple-700 text-white hover:bg-purple-600'
              }
            `}
            aria-label={isExpanded ? 'Cerrar atajos' : 'Mostrar atajos'}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${
                isExpanded ? 'rotate-45' : 'rotate-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      <div
        className={`
          px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border
          ${darkMode
            ? 'bg-purple-900/80 border-purple-700/50 text-white'
            : 'bg-white/90 border-purple-200 text-gray-800'
          }
        `}
      >
        {/* Toggle between shortcuts and recent pages */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors
              ${!isExpanded
                ? darkMode
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-700'
                : darkMode
                  ? 'text-purple-300 hover:text-white'
                  : 'text-purple-600 hover:text-purple-800'
              }
            `}
          >
            Atajos
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors
              ${isExpanded
                ? darkMode
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-700'
                : darkMode
                  ? 'text-purple-300 hover:text-white'
                  : 'text-purple-600 hover:text-purple-800'
              }
            `}
          >
            Recientes
          </button>
        </div>

        {/* Shortcuts or Recent Pages */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(!isExpanded ? shortcuts : recentPages).map((item) => (
            <button
              key={item.path}
              onClick={() => handleShortcutClick(item.path)}
              className={`
                flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg
                transition-colors duration-200 min-w-0
                ${darkMode
                  ? 'bg-purple-700/50 text-purple-200 hover:bg-purple-600/70 active:bg-purple-500/70'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 active:bg-purple-200'
                }
              `}
              title={item.title}
            >
              {item.icon && (
                <span className="text-sm flex-shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="text-xs font-medium truncate max-w-16">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {((!isExpanded && shortcuts.length === 0) || 
          (isExpanded && recentPages.length === 0)) && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">
              {!isExpanded ? 'No hay atajos disponibles' : 'No hay páginas recientes'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavigationShortcuts;