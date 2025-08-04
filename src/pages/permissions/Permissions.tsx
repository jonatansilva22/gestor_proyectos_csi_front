// src/pages/permissions/Permissions.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, UserFilters } from "../../types/permissions";
import { permissionsService, backendPermissionsService } from "../../services/permissions";
import { UserPermissionResponse } from "../../types/backend-permissions";
import { useTheme } from "../../context/ThemeContext";
// import { useBackendPermissions } from "../../hooks/useBackendPermissions";
import { 
  PermissionsHeader,
  UserRow,
  TableHeader,
  PermissionsFilters,
  BulkActionsToolbar,
  BackendPermissionsModal
} from "../../components/permissions";

// Extend the User type to include backend permissions
interface UserWithBackendPermissions extends User {
  backendPermissions?: UserPermissionResponse;
}

export default function Permissions() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  // Estados principales
  const [users, setUsers] = useState<UserWithBackendPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Estados del modal de permisos
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  
  // Estados de filtros y selección
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  
  
  // Hook para permisos del backend - no necesario ya que todos pueden ver el modal
  // const backendPermissions = useBackendPermissions();
  // Todos los usuarios pueden acceder al modal de permisos completo

  useEffect(() => {
    loadUsers();
  }, []);
  
  
  // Filtrar usuarios basado en los filtros aplicados
  const filteredData = useMemo(() => {
    let result = [...users];
    
    // Aplicar filtro de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtro de estado activo
    if (filters.isActive !== undefined) {
      result = result.filter(user => user.isActive === filters.isActive);
    }
    
    // Aplicar filtro de estado
    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }
    
    // Aplicar ordenamiento
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof User];
        let bValue = b[filters.sortBy as keyof User];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    
    return result;
  }, [users, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await permissionsService.getUsers();
      
      // Fetch backend permissions for each user
      const usersWithPermissions = await Promise.all(
        response.users.map(async (user) => {
          try {
            const backendPermissions = await backendPermissionsService.getUserPermissions(user.id);
            return { ...user, backendPermissions };
          } catch (error) {
            console.error(`Error loading permissions for user ${user.id}:`, error);
            // Return user without backend permissions if the call fails
            return user;
          }
        })
      );

      setUsers(usersWithPermissions);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionsClick = (user: User) => {
    console.log('Opening permissions for user:', user);
    setSelectedUserId(user.id);
    setIsBackendModalOpen(true);
    console.log('Modal state set to open');
  };

  const handleDeleteClick = async (user: User) => {
    if (
      window.confirm(`¿Estás seguro de que quieres eliminar a ${user.name}?`)
    ) {
      try {
        await permissionsService.deleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setHasChanges(true);
        toast.success(`${user.name} ha sido eliminado`);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error al eliminar el usuario");
      }
    }
  };


  
  
  const handleCloseModal = () => {
    setIsBackendModalOpen(false);
    setSelectedUserId(null);
  };
  
  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    setFilters({});
  };
  
  // const handleSelectAll = () => {
  //   setSelectedUserIds(filteredData.map(u => u.id));
  // };
  
  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedUserIds.length} usuarios?`)) {
      try {
        await Promise.all(
          selectedUserIds.map(id => permissionsService.deleteUser(id))
        );
        setUsers(prev => prev.filter(u => !selectedUserIds.includes(u.id)));
        setSelectedUserIds([]);
        setHasChanges(true);
        toast.success(`${selectedUserIds.length} usuarios eliminados`);
      } catch (error) {
        console.error('Error deleting users:', error);
        toast.error('Error al eliminar los usuarios');
      }
    }
  };
  
  const handleBulkPermissionsUpdate = async () => {
    if (selectedUserIds.length === 0) return;
    
    // This function needs to be adapted to handle backend permissions
    console.warn("Bulk update for backend permissions not implemented yet");
    toast.info("La actualización masiva de permisos del backend aún no está implementada.");

  };
  
  const handleUserSelect = (userId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
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
      if (
        window.confirm(
          "¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.",
        )
      ) {
        loadUsers(); // Reload original data
        setHasChanges(false);
      }
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div
        className={`
          min-h-screen w-full flex flex-col
          ${darkMode ? "bg-[#1A0F30]" : "bg-slate-100"}
        `}
      >
        <PermissionsHeader onBack={() => navigate("/dashboard")} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen w-full
        ${darkMode ? "bg-[#1A0F30]" : "bg-slate-100"}
      `}
    >
      {/* Header */}
      <PermissionsHeader onBack={() => navigate("/dashboard")} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">        
        {/* Filters */}
        <div className="mb-6 sm:mb-8">
          <PermissionsFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        {/* Bulk Actions */}
        {selectedUserIds.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <BulkActionsToolbar
              selectedCount={selectedUserIds.length}
              onUpdatePermissions={handleBulkPermissionsUpdate}
              onDelete={handleBulkDelete}
            />
          </div>
        )}
        
        {/* Users count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredData.length} usuario{filteredData.length !== 1 ? 's' : ''} encontrado{filteredData.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Users Table */}
        <div
          className={`rounded-lg border overflow-hidden shadow-sm ${
            darkMode
              ? "bg-[#3A2B5A] border-purple-700/40"
              : "bg-white border-gray-200"
          }`}
        >
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className={`mx-auto w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                {users.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios"}
              </h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
                {users.length === 0 ? "Comienza creando tu primer usuario" : "Intenta ajustar los filtros de búsqueda"}
              </p>
              <button
                onClick={handleCreateUser}
                className="bg-[#6F43D6] hover:bg-[#5A35B3] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Crear Usuario
              </button>
            </div>
          ) : (
            <div className="max-h-[60vh] sm:max-h-[70vh] overflow-auto">
              <TableHeader />
              <div className="divide-y divide-gray-200">
                {filteredData.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelected={selectedUserIds.includes(user.id)}
                    onSelect={(isSelected) => handleUserSelect(user.id, isSelected)}
                    onPermissionsClick={handlePermissionsClick}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 sm:mt-8">
          {/* Create User Button */}
          <button
            onClick={handleCreateUser}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#6F43D6] hover:bg-[#5A35B3] text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-normal">Crear usuario</span>
          </button>

          {/* Save/Cancel Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className={`px-6 py-2 font-normal transition-colors duration-200 ${
                darkMode ? "text-white hover:text-gray-300" : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className={`px-6 py-3 bg-[#6F43D6] hover:bg-[#5A35B3] text-white rounded-lg transition-colors duration-200 ${
                hasChanges ? "" : "opacity-75"
              }`}
            >
              <span className="font-normal">Guardar</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Permisos Completo */}
      {selectedUserId && (
        <BackendPermissionsModal
          userId={selectedUserId}
          isOpen={isBackendModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
