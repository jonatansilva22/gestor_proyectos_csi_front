import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { MobileNavigationProvider } from "./context/MobileNavigationContext";
import { ProtectedRoute } from "./components/auth";
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
import NotificationsPage from "./features/profile/pages/NotificationsPage";
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
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Rutas protegidas con autenticación */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-user" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UsersManagementPage /></ProtectedRoute>} />

            {/* Módulo de proyectos - Todos los usuarios autenticados */}
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/projects-table" element={<ProtectedRoute><ProjectsTablePage /></ProtectedRoute>} />
            <Route path="/areas-table" element={<ProtectedRoute><AreasTablePage /></ProtectedRoute>} />
            <Route path="/repositories-table" element={<ProtectedRoute><RepositoriesTablePage /></ProtectedRoute>} />
            <Route path="/tools-table" element={<ProtectedRoute><ToolsTablePage /></ProtectedRoute>} />
            <Route path="/groups-table" element={<ProtectedRoute><GroupsTablePage /></ProtectedRoute>} />

            {/* Rutas de configuración de usuario - Todos los usuarios autenticados */}
            <Route path="/settings/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings/password" element={<ProtectedRoute><PasswordPage /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
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
