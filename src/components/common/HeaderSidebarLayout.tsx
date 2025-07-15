// src/components/common/HeaderSidebarLayout.tsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import SidebarMenu from "./SidebarMenu";

interface HeaderSidebarLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

const HeaderSidebarLayout: React.FC<HeaderSidebarLayoutProps> = ({
  children,
  headerTitle = "CSI PRO",
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const { user } = useAuth();
  const username = user?.username || "Usuario";

  return (
    <div className="flex min-h-screen">
      <SidebarMenu
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        username={username}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header title={headerTitle} onMenuClick={toggleSidebar} />
        <main className="p-4 flex-1 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
};

export default HeaderSidebarLayout;
