import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Login, LogoutPage } from "./pages/auth";
import { CreateUser } from "./pages/users";
import { Permissions } from "./pages/permissions";
import Dashboard from "./pages/Dashboard";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { ProjectDetailPage } from "./pages/projects/ProjectDetailPage";
import { ProjectsTablePage } from "./pages/projects/ProjectsTablePage";
import { AreasTablePage } from "./pages/areas/AreasTablePage";
import { RepositoriesTablePage } from "./pages/repositories/RepositoriesTablePage";
import { ToolsTablePage } from "./pages/tools/ToolsTablePage";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/logout" element={<LogoutPage />} />

            {/* Rutas protegidas por el login */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/permissions" element={<Permissions />} />

            {/* Módulo de proyectos o CRUDs */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects-table" element={<ProjectsTablePage />} />
            <Route path="/areas-table" element={<AreasTablePage />} />
            <Route path="/repositories-table" element={<RepositoriesTablePage />} />
            <Route path="/tools-table" element={<ToolsTablePage />} />

            {/* Redirección de cualquier errorcillo */}
            <Route path="*" element={<Login />} />
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
            theme="light"
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
