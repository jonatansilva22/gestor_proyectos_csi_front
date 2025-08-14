// src/components/navigation/MobileBreadcrumbs.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useMobileNavigation } from '../../hooks/useMobileNavigation';

interface MobileBreadcrumbsProps {
  className?: string;
  maxItems?: number;
  showIcons?: boolean;
  compact?: boolean;
}

const MobileBreadcrumbs: React.FC<MobileBreadcrumbsProps> = ({
  className = '',
  maxItems = 3,
  showIcons = true,
  compact = false,
}) => {
  const { darkMode } = useTheme();
  const { breadcrumbs, navigateToPath, isMobile } = useMobileNavigation();

  if (!breadcrumbs.length || (!isMobile && !compact)) {
    return null;
  }

  // Truncate breadcrumbs if needed
  const displayBreadcrumbs = breadcrumbs.length > maxItems
    ? [
        breadcrumbs[0], // Always show root
        { path: '...', title: '...', icon: '', timestamp: 0 }, // Ellipsis
        ...breadcrumbs.slice(-maxItems + 2) // Show last items
      ]
    : breadcrumbs;

  return (
    <nav
      className={`flex items-center space-x-1 overflow-hidden ${className}`}
      aria-label="Navegación de migas de pan"
    >
      <div className="flex items-center space-x-1 min-w-0 flex-1">
        {displayBreadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            {/* Breadcrumb Item */}
            <div className="flex items-center min-w-0">
              {breadcrumb.path === '...' ? (
                // Ellipsis indicator
                <span
                  className={`px-1 text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  ...
                </span>
              ) : (
                <button
                  onClick={() => navigateToPath(breadcrumb.path)}
                  disabled={index === displayBreadcrumbs.length - 1} // Disable current page
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium
                    transition-colors duration-200 min-w-0
                    ${
                      index === displayBreadcrumbs.length - 1
                        ? // Current page styling
                          darkMode
                          ? 'text-purple-300 bg-purple-800/30 cursor-default'
                          : 'text-purple-700 bg-purple-100 cursor-default'
                        : // Clickable breadcrumb styling
                          darkMode
                          ? 'text-gray-300 hover:text-white hover:bg-purple-700/20 focus:bg-purple-700/30 focus:outline-none'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none'
                    }
                  `}
                  aria-current={index === displayBreadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {showIcons && breadcrumb.icon && (
                    <span className="text-xs flex-shrink-0" aria-hidden="true">
                      {breadcrumb.icon}
                    </span>
                  )}
                  <span className="truncate">
                    {compact && breadcrumb.title.length > 12
                      ? `${breadcrumb.title.substring(0, 12)}...`
                      : breadcrumb.title
                    }
                  </span>
                </button>
              )}
            </div>

            {/* Separator */}
            {index < displayBreadcrumbs.length - 1 && (
              <svg
                className={`w-3 h-3 flex-shrink-0 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default MobileBreadcrumbs;