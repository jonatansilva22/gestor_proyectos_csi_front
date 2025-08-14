import HeaderSidebarLayout from "../components/common/HeaderSidebarLayout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirigir colaboradores a /projects
  useEffect(() => {
    if (!user) return;
    if (user.role === 3) {
      navigate('/projects', { replace: true });
    }
  }, [user, navigate]);
  
  return (
    <HeaderSidebarLayout headerTitle="CSI PRO - Dashboard">
      <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Dashboard
      </h1>
      {/* Aquí más contenido del Dashboard */}
    </HeaderSidebarLayout>
  );
}
