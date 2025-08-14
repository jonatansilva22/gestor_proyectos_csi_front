// src/context/MobileNavigationContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMobileNavigation } from '../hooks/useMobileNavigation';

interface MobileNavigationContextType {
  // Sidebar state
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  
  // Swipe gesture support
  enableSwipeGestures: boolean;
  setEnableSwipeGestures: (enable: boolean) => void;
  
  // Navigation state
  showBreadcrumbs: boolean;
  setShowBreadcrumbs: (show: boolean) => void;
  
  // Mobile navigation helpers
  navigationHelpers: ReturnType<typeof useMobileNavigation>;
  
  // Touch preferences
  hapticFeedback: boolean;
  setHapticFeedback: (enable: boolean) => void;
  
  // Swipe thresholds
  swipeThreshold: number;
  setSwipeThreshold: (threshold: number) => void;
}

const MobileNavigationContext = createContext<MobileNavigationContextType | undefined>(undefined);

interface MobileNavigationProviderProps {
  children: ReactNode;
}

export const MobileNavigationProvider: React.FC<MobileNavigationProviderProps> = ({ children }) => {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mobile navigation preferences
  const [enableSwipeGestures, setEnableSwipeGestures] = useState(true);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [swipeThreshold, setSwipeThreshold] = useState(50);

  // Get navigation helpers
  const navigationHelpers = useMobileNavigation();

  // Sidebar control functions
  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open);
    
    // Haptic feedback on mobile devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(open ? 50 : 30);
    }
  }, [hapticFeedback]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen, setSidebarOpen]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  // Auto-close sidebar on desktop
  React.useEffect(() => {
    if (!navigationHelpers.isOnMobileDevice && isSidebarOpen) {
      // Keep sidebar open on desktop
      setIsSidebarOpen(true);
    } else if (navigationHelpers.isOnMobileDevice) {
      // Close sidebar by default on mobile
      setIsSidebarOpen(false);
    }
  }, [navigationHelpers.isOnMobileDevice, isSidebarOpen]);

  const contextValue: MobileNavigationContextType = {
    // Sidebar state
    isSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    closeSidebar,
    
    // Swipe gesture support
    enableSwipeGestures,
    setEnableSwipeGestures,
    
    // Navigation state
    showBreadcrumbs,
    setShowBreadcrumbs,
    
    // Navigation helpers
    navigationHelpers,
    
    // Touch preferences
    hapticFeedback,
    setHapticFeedback,
    
    // Swipe thresholds
    swipeThreshold,
    setSwipeThreshold,
  };

  return (
    <MobileNavigationContext.Provider value={contextValue}>
      {children}
    </MobileNavigationContext.Provider>
  );
};

export const useMobileNavigationContext = (): MobileNavigationContextType => {
  const context = useContext(MobileNavigationContext);
  if (!context) {
    throw new Error('useMobileNavigationContext must be used within a MobileNavigationProvider');
  }
  return context;
};