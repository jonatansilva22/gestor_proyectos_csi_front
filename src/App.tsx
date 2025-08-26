import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { MobileNavigationProvider } from "./context/MobileNavigationContext";
import { ProtectedRoute } from "./components/auth";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import Login from "./pages/auth/Login";
import LogoutPage from "./pages/auth/LogoutPage";
import CreateUser from "./pages/users/CreateUser";
import Dashboard from "./pages/dashboard/DashboardPage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { ProjectDetailPage } from "./pages/projects/ProjectDetailPage";
import { ProjectsTablePage } from "./pages/projects/ProjectsTablePage";
import { AreasTablePage } from "./pages/areas/AreasTablePage";
import { RepositoriesTablePage } from "./pages/repositories/RepositoriesTablePage";
import { ToolsTablePage } from "./pages/tools/ToolsTablePage";
import { GroupsTablePage } from "./pages/groups/GroupsTablePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import PasswordPage from "./features/profile/pages/PasswordPage";
import ThemePage from "./features/profile/pages/ThemePage";
import UsersManagementPage from "./features/admin/pages/UsersManagementPage";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Component that uses the theme context for ToastContainer
const AppContent = () => {
  const { darkMode } = useTheme();
  
  
  return (
    <>
      <Router>
        <MobileNavigationProvider>
          <Routes>
            {/* Ruta raíz redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Rutas solo para Admin y SuperAdmin */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <Dashboard />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/create-user" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <CreateUser />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <UsersManagementPage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/areas-table" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <AreasTablePage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/repositories-table" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <RepositoriesTablePage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/tools-table" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <ToolsTablePage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />
            <Route path="/groups-table" element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={[1, 2]} redirectTo="/projects">
                  <GroupsTablePage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } />

            {/* Módulo de proyectos - Disponible para todos los usuarios (Admin, SuperAdmin, Colaborador) */}
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/projects-table" element={<ProtectedRoute><ProjectsTablePage /></ProtectedRoute>} />

            {/* Configuración de perfil - Disponible para todos los usuarios */}
            {/* Los colaboradores pueden ver/editar solo su propio perfil gracias a las validaciones del backend */}
            <Route path="/settings/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings/password" element={<ProtectedRoute><PasswordPage /></ProtectedRoute>} />
            <Route path="/settings/theme" element={<ProtectedRoute><ThemePage /></ProtectedRoute>} />

            {/* Página de error 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            limit={3}
            theme={darkMode ? "dark" : "light"}
          />
        </MobileNavigationProvider>
      </Router>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
