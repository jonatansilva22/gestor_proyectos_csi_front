import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { notifyError } from '../../../components/common/ToastNotify';
import HeaderSidebarLayout from '../../../components/common/HeaderSidebarLayout';
import UserFilters from '../components/UserFilters';
import UsersTable from '../components/UsersTable';
import EditUserModal from '../components/EditUserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import { useUsers } from '../hooks/useUsers';
import { User, CreateUserRequest } from '../../../types/user';

const UsersManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const {
    users,
    loading,
    error,
    pagination,
    searchTerm,
    roleFilter,
    setSearchTerm,
    setRoleFilter,
    setCurrentPage,
    refreshUsers,
    deleteUser,
    updateUser,
  } = useUsers();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    // Solo SuperAdmin (rol 2) puede borrar usuarios
    if (currentUser?.role !== 2) {
      notifyError('No tienes permisos para eliminar usuarios. Solo el SuperAdmin puede realizar esta acción.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSaveUser = async (id: number, userData: Partial<CreateUserRequest>) => {
    setIsSaving(true);
    try {
      await updateUser(id, userData);
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch {
      // Error is handled by useUsers hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(selectedUser.id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch {
      // Error is handled by useUsers hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateUser = () => {
    navigate('/create-user');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    const buttonBaseClasses = "px-4 py-2 rounded-xl transition-all duration-200 font-medium";
    const disabledClasses = darkMode 
      ? "text-gray-500 cursor-not-allowed bg-gray-800/50" 
      : "text-gray-400 cursor-not-allowed bg-gray-100";
    const enabledClasses = darkMode 
      ? "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50" 
      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-500";
    const activeClasses = darkMode
      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 border border-purple-500"
      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 border border-purple-500";

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
        className={`${buttonBaseClasses} flex items-center gap-2 ${pagination.currentPage === 1 ? disabledClasses : enabledClasses}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>
    );

    // First page and ellipsis
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`${buttonBaseClasses} ${enabledClasses}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className={darkMode ? "text-gray-400 px-2" : "text-gray-500 px-2"}>
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${buttonBaseClasses} min-w-[44px] ${i === pagination.currentPage ? activeClasses : enabledClasses}`}
        >
          {i}
        </button>
      );
    }

    // Last page and ellipsis
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={darkMode ? "text-gray-400 px-2" : "text-gray-500 px-2"}>
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className={`${buttonBaseClasses} ${enabledClasses}`}
        >
          {pagination.totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
        className={`${buttonBaseClasses} flex items-center gap-2 ${pagination.currentPage === pagination.totalPages ? disabledClasses : enabledClasses}`}
      >
        Siguiente
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return (
      <div className={`rounded-2xl p-6 mt-8 shadow-lg ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Mostrando página {pagination.currentPage} de {pagination.totalPages} 
            <span className={`ml-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ({pagination.totalCount} usuarios en total)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {pages}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    const { darkMode } = useTheme();
    return (
      <HeaderSidebarLayout headerTitle="Gestión de Usuarios">
        <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className={`max-w-7xl mx-auto p-8 rounded-2xl text-center border shadow-lg ${
            darkMode 
              ? 'bg-gray-800 border-red-600' 
              : 'bg-white border-red-200'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Error al cargar usuarios
            </h3>
            <p className="text-red-500 mb-4">
              {error}
            </p>
            <button
              onClick={refreshUsers}
              className={`px-4 py-2 text-white rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </HeaderSidebarLayout>
    );
  }

  return (
    <HeaderSidebarLayout headerTitle="Gestión de Usuarios">
      <div className={`min-h-screen p-6 transition-all duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`rounded-3xl p-8 mb-8 relative overflow-hidden ${
            darkMode 
              ? 'bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-800' 
              : 'bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600'
          }`}>
            <div className={`absolute inset-0 backdrop-blur-sm ${
              darkMode ? 'bg-black/10' : 'bg-white/10'
            }`} />
            <div className="relative z-10">
              {/* Main Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-white text-3xl font-bold mb-2">Gestión de Usuarios</h1>
                    <p className="text-purple-100 text-lg opacity-90">Administra todos los usuarios del sistema</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCreateUser}
                  className="px-6 py-3 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/20 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Usuario
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Total Usuarios</p>
                      <p className="text-white text-2xl font-bold">{pagination.totalCount || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">SuperAdmins</p>
                      <p className="text-white text-2xl font-bold">
                        {loading ? '...' : users.filter(u => (u as any).role_id === 1).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Admins</p>
                      <p className="text-white text-2xl font-bold">
                        {loading ? '...' : users.filter(u => (u as any).role_id === 2).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Colaboradores</p>
                      <p className="text-white text-2xl font-bold">
                        {loading ? '...' : users.filter(u => (u as any).role_id === 3 || u.role === 3 || (u as any).role?.id === 3).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            totalUsers={pagination.totalCount}
          />

          {/* Users Table */}
          <UsersTable
            users={users}
            loading={loading}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            currentUserId={currentUser?.id}
          />

          {/* Pagination */}
          {renderPagination()}

          {/* Modals */}
          <EditUserModal
            user={selectedUser}
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSave={handleSaveUser}
            isSaving={isSaving}
          />

          {selectedUser && (
            <DeleteUserModal
              user={selectedUser}
              isOpen={deleteModalOpen}
              onClose={() => {
                setDeleteModalOpen(false);
                setSelectedUser(null);
              }}
              onConfirm={handleConfirmDelete}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>
    </HeaderSidebarLayout>
  );
};

export default UsersManagementPage;
