import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUserForm } from "../../components/user/CreateUserForm";
import { CreateUserRequest } from "../../types/user";
import HeaderSidebarLayout from "../../components/common/HeaderSidebarLayout";

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  // Al crear correctamente, volver a la gestión de usuarios
  const handleSuccess = useCallback((userData: CreateUserRequest) => {
    const role = userData.role;
    const isColaborador = role === "colaborador" || role === 3;

    if (isColaborador) {
      // Redirige a proyectos si el nuevo usuario es colaborador
      navigate("/projects");
    } else {
      // Para roles distintos, ir a gestión de usuarios
      navigate("/admin/users");
    }
  }, [navigate]);

  return (
    <HeaderSidebarLayout headerTitle="Crear usuario">
      <div className="max-w-[480px] mx-auto md:mx-0">
        <CreateUserForm mode="page" onSuccess={handleSuccess} />
      </div>
    </HeaderSidebarLayout>
  );
};

export default CreateUser;
