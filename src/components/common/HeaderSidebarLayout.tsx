// src/components/common/HeaderSidebarLayout.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useSidebarSwipe } from "../../hooks/useSidebarSwipe";
import Header from "./Header";
import SidebarMenu from "./SidebarMenu";
import MobileBreadcrumbs from "../../components/navigation/MobileBreadcrumbs";

interface HeaderSidebarLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  showBreadcrumbs?: boolean;
}

const HeaderSidebarLayout: React.FC<HeaderSidebarLayoutProps> = ({
  children,
  headerTitle = "CSI PRO",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const username = user?.username || "Usuario";
  const showSidebar = (user?.role ?? 3) !== 3; // Ocultar sidebar para Colaborador (rol 3)
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  // Handle responsive sidebar behavior
  useEffect(() => {
    if (!showSidebar) {
      setIsSidebarOpen(false);
      return;
    }
    if (isDesktop) {
      // On desktop, sidebar should be open by default
      setIsSidebarOpen(true);
    } else {
      // On mobile and tablet, sidebar should be closed by default
      setIsSidebarOpen(false);
    }
  }, [isDesktop, isMobile, isTablet, showSidebar]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  // Enhanced swipe gesture support for sidebar
  const sidebarSwipe = useSidebarSwipe({
    isOpen: isSidebarOpen,
    onOpen: openSidebar,
    onClose: closeSidebar,
    enabled: isMobile || isTablet,
    swipeThreshold: 50,
    edgeSwipeZone: 30,
  });

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile || isTablet) {
      closeSidebar();
    }
  };

  return (
    <div 
      ref={sidebarSwipe.containerRef}
      className={`flex min-h-screen transition-colors duration-200 ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}
    >
      {/* Sidebar */}
      {showSidebar && (
        <SidebarMenu
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
          username={username}
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
        />
      )}

      {/* Mobile/Tablet Backdrop with enhanced touch handling */}
      {showSidebar && isSidebarOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={handleBackdropClick}
          onTouchStart={handleBackdropClick} // Enhanced touch support
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          // Desktop: Always account for sidebar width when open
          isDesktop && isSidebarOpen 
            ? "ml-64" 
            : isMobile || isTablet
              ? "ml-0"  // Mobile/tablet: never push content, sidebar overlays
              : "ml-0"  // Desktop with sidebar closed
        }`}
      >
        <Header 
          title={headerTitle} 
          onMenuClick={toggleSidebar}
          showMenuButton={showSidebar}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* Mobile Breadcrumbs */}
        {(isMobile || isTablet) && (
          <div className={`px-3 py-2 border-b ${
            darkMode ? 'border-purple-700/30 bg-[#1A0F30]' : 'border-gray-200 bg-white'
          }`}>
            <MobileBreadcrumbs maxItems={3} compact={isMobile} />
          </div>
        )}
        
        <main className={`
          flex-1 overflow-auto transition-colors duration-200
          p-3 sm:p-4 md:p-6 lg:p-8
          ${darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'}
        `}>
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HeaderSidebarLayout;
