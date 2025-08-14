// src/hooks/useMobileNavigation.ts
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from './useMediaQuery';

interface NavigationItem {
  path: string;
  title: string;
  icon?: string;
  timestamp: number;
}

interface MobileNavigationState {
  currentPage: NavigationItem | null;
  navigationHistory: NavigationItem[];
  canGoBack: boolean;
  breadcrumbs: NavigationItem[];
}

// Route configuration for breadcrumbs and titles
const routeConfig: Record<string, { title: string; icon?: string; parent?: string }> = {
  '/dashboard': { title: 'Dashboard', icon: '📊' },
  '/projects-table': { title: 'Proyectos', icon: '📁' },
  '/projects': { title: 'Proyecto', icon: '📁', parent: '/projects-table' },
  '/create-user': { title: 'Crear Usuario', icon: '👤' },
  '/areas-table': { title: 'Áreas', icon: '🏢' },
  '/repositories-table': { title: 'Repositorios', icon: '📚' },
  '/tools-table': { title: 'Herramientas', icon: '🔧' },
  '/groups-table': { title: 'Grupos', icon: '👥' },
  '/admin/users': { title: 'Gestión de Usuarios', icon: '⚙️' },
  '/profile': { title: 'Perfil', icon: '👤' },
  '/profile/password': { title: 'Cambiar Contraseña', icon: '🔑', parent: '/profile' },
  '/profile/notifications': { title: 'Notificaciones', icon: '🔔', parent: '/profile' },
  '/profile/theme': { title: 'Tema', icon: '🎨', parent: '/profile' },
};

export const useMobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const [navigationState, setNavigationState] = useState<MobileNavigationState>({
    currentPage: null,
    navigationHistory: [],
    canGoBack: false,
    breadcrumbs: [],
  });

  // Get route info from configuration
  const getRouteInfo = useCallback((path: string): NavigationItem => {
    // Check for dynamic routes (e.g., /projects/123)
    const dynamicRouteMatch = path.match(/^\/projects\/(\d+)$/);
    if (dynamicRouteMatch) {
      return {
        path,
        title: `Proyecto #${dynamicRouteMatch[1]}`,
        icon: '📁',
        timestamp: Date.now(),
      };
    }

    // Check exact matches first
    const config = routeConfig[path];
    if (config) {
      return {
        path,
        title: config.title,
        icon: config.icon,
        timestamp: Date.now(),
      };
    }

    // Fallback for unmatched routes
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const title = lastSegment ? lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Página';
    
    return {
      path,
      title,
      icon: '📄',
      timestamp: Date.now(),
    };
  }, []);

  // Build breadcrumbs based on current path and parent relationships
  const buildBreadcrumbs = useCallback((currentPath: string): NavigationItem[] => {
    const breadcrumbs: NavigationItem[] = [];
    let path = currentPath;

    // Add current page
    breadcrumbs.unshift(getRouteInfo(path));

    // Build parent chain
    while (path && routeConfig[path]?.parent) {
      path = routeConfig[path].parent!;
      breadcrumbs.unshift(getRouteInfo(path));
    }

    // Always add dashboard as root if not already present and not on dashboard
    if (currentPath !== '/dashboard' && !breadcrumbs.find(b => b.path === '/dashboard')) {
      breadcrumbs.unshift(getRouteInfo('/dashboard'));
    }

    return breadcrumbs;
  }, [getRouteInfo]);

  // Update navigation state when location changes
  useEffect(() => {
    const currentPage = getRouteInfo(location.pathname);
    const breadcrumbs = buildBreadcrumbs(location.pathname);

    setNavigationState(prev => {
      // Don't add to history if it's the same page
      const lastHistoryItem = prev.navigationHistory[prev.navigationHistory.length - 1];
      const shouldAddToHistory = !lastHistoryItem || lastHistoryItem.path !== location.pathname;

      const newHistory = shouldAddToHistory
        ? [...prev.navigationHistory.slice(-9), currentPage] // Keep last 10 items
        : prev.navigationHistory;

      return {
        currentPage,
        navigationHistory: newHistory,
        canGoBack: newHistory.length > 1 || window.history.length > 1,
        breadcrumbs,
      };
    });
  }, [location.pathname, getRouteInfo, buildBreadcrumbs]);

  // Navigation helpers
  const goBack = useCallback(() => {
    const history = navigationState.navigationHistory;
    if (history.length > 1) {
      // Go to previous page in our history
      const previousPage = history[history.length - 2];
      navigate(previousPage.path);
    } else {
      // Fallback to browser back
      navigate(-1);
    }
  }, [navigationState.navigationHistory, navigate]);

  const goToParent = useCallback(() => {
    const currentPath = location.pathname;
    const config = routeConfig[currentPath];
    
    if (config?.parent) {
      navigate(config.parent);
    } else {
      // Fallback to removing last segment
      const pathSegments = currentPath.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
        pathSegments.pop();
        navigate('/' + pathSegments.join('/'));
      } else {
        navigate('/dashboard');
      }
    }
  }, [location.pathname, navigate]);

  const navigateToPath = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Get navigation shortcuts for current context
  const getContextualShortcuts = useCallback(() => {
    const shortcuts: NavigationItem[] = [];
    const currentPath = location.pathname;

    // Add parent navigation if available
    const config = routeConfig[currentPath];
    if (config?.parent) {
      shortcuts.push(getRouteInfo(config.parent));
    }

    // Add common shortcuts based on current page
    if (currentPath.startsWith('/projects')) {
      shortcuts.push(getRouteInfo('/projects-table'));
    }

    // Always add dashboard as a shortcut (unless we're already there)
    if (currentPath !== '/dashboard') {
      shortcuts.push(getRouteInfo('/dashboard'));
    }

    return shortcuts;
  }, [location.pathname, getRouteInfo]);

  return {
    ...navigationState,
    isMobile,
    isTablet,
    goBack,
    goToParent,
    navigateToPath,
    getContextualShortcuts,
    isOnMobileDevice: isMobile || isTablet,
  };
};