import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { CreateUserForm } from "../../components/user/CreateUserForm";
import { CreateUserRequest } from "../../types/user";

import Header from "../../components/common/Header";
import SidebarMenu from "../../components/common/SidebarMenu";

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Aquí puedes obtener el username de tu contexto auth o dejar fijo
  const username = "Usuario";

  const handleSuccess = (userData: CreateUserRequest) => {
    console.log("Usuario creado:", userData);
    navigate("/dashboard");
  };

  // const handleClose = () => {
  //   navigate("/dashboard");
  // };

  return (
    <>
      {/* Header con botón para abrir sidebar */}
      <Header title="Crear Usuario" onMenuClick={toggleSidebar} />

      {/* Sidebar */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        username={username}
      />

      {/* Contenido principal, que se mueve si el sidebar está abierto */}
      <div
        className={`min-h-screen w-full flex flex-col transition-all duration-300 ${
          darkMode ? "bg-[#1A0F30]" : "bg-slate-100"
        } ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 md:px-[53px] md:py-8">
          <div className="max-w-[480px] mx-auto md:mx-0">
            <CreateUserForm mode="page" onSuccess={handleSuccess} />
          </div>
        </main>
      </div>
    </>
  );
};

export default CreateUser;
