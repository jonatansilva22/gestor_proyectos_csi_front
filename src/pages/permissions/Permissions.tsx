import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Student, StudentPermissions } from "../../types/permissions";
import { permissionsService } from "../../services/permissions";
import { useTheme } from "../../context/ThemeContext";
import { PermissionsHeader } from "../../components/permissions/PermissionsHeader";
import { StudentRow } from "../../components/permissions/StudentRow";
import { PermissionsModal } from "../../components/permissions/PermissionsModal";
import { TableHeader } from "../../components/permissions/TableHeader";

import Header from "../../components/common/Header";
import SidebarMenu from "../../components/common/SidebarMenu";

export default function Permissions() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Aquí deberías obtener el username real desde el contexto de autenticación
  const username = "Usuario";

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await permissionsService.getStudents();
      setStudents(response.students);
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionsClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (student: Student) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${student.name}?`)) {
      try {
        await permissionsService.deleteStudent(student.id);
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        setHasChanges(true);
        toast.success(`${student.name} ha sido eliminado`);
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Error al eliminar el estudiante");
      }
    }
  };

  const handleSavePermissions = async (studentId: number, permissions: StudentPermissions) => {
    try {
      const updatedStudent = await permissionsService.updateStudentPermissions({
        studentId,
        permissions,
      });

      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? updatedStudent : s)),
      );
      setHasChanges(true);
      toast.success("Permisos actualizados correctamente");
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Error al actualizar los permisos");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleSave = () => {
    if (hasChanges) {
      toast.success("Cambios guardados correctamente");
      setHasChanges(false);
    } else {
      toast.info("No hay cambios para guardar");
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.")) {
        loadStudents();
        setHasChanges(false);
      }
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen w-full flex flex-col ${
          darkMode ? "bg-[#1A0F30]" : "bg-slate-100"
        }`}
      >
        {/* Header */}
        <Header title="Permisos" onMenuClick={toggleSidebar} />
        <SidebarMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} username={username} />
        
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Header title="Permisos" onMenuClick={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} username={username} />

      {/* Contenedor principal con margen para el sidebar */}
      <div
        className={`min-h-screen w-full flex flex-col transition-all duration-300 ${
          darkMode ? "bg-[#1A0F30]" : "bg-slate-100"
        } ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Main Content */}
        <main className="flex-1 px-4 py-6 md:px-[53px] md:py-8">
          {/* Students List */}
          <div className="max-w-6xl mx-auto">
            <div
              className={`rounded-xl border overflow-hidden ${
                darkMode
                  ? "bg-[#3A2B5A] border-purple-700/40 shadow-2xl shadow-purple-900/30"
                  : "bg-white border-purple-300 shadow-2xl shadow-purple-200/40"
              }`}
            >
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                    No hay estudiantes registrados
                  </p>
                </div>
              ) : (
                <>
                  <TableHeader />
                  <div className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        onPermissionsClick={handlePermissionsClick}
                        onDeleteClick={handleDeleteClick}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Create User Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleCreateUser}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6F43D6] hover:bg-[#5A35B3] text-white rounded-lg border border-gray-600 transition-colors duration-200"
            >
              <span className="font-inter text-base font-normal">Crear usuario</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-6 mt-12">
            <button
              onClick={handleCancel}
              className={`font-inter text-base font-normal ${
                darkMode ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"
              } transition-colors duration-200`}
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#6F43D6] hover:bg-[#5A35B3] text-white rounded-lg border border-gray-600 transition-colors duration-200 ${
                hasChanges ? "" : "opacity-75"
              }`}
            >
              <span className="font-inter text-base font-normal">Guardar</span>
            </button>
          </div>
        </main>

        {/* Permissions Modal */}
        <PermissionsModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePermissions}
        />
      </div>
    </>
  );
}
