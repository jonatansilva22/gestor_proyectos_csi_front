import { useState, useEffect } from 'react';
import { User, CreateUserRequest } from '../../../types/user';
import { userService } from '../../../services/users/userService';
import { notifySuccess, notifyError } from '../../../components/common/ToastNotify';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
  };
  searchTerm: string;
  roleFilter: string;
  setSearchTerm: (term: string) => void;
  setRoleFilter: (role: string) => void;
  setCurrentPage: (page: number) => void;
  refreshUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateUser: (id: number, userData: Partial<CreateUserRequest>) => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers();
      
      // Filter users based on search and role filter
      let filteredUsers = Array.isArray(response) ? response : [];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter((user: User) =>
          user.username?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.first_name?.toLowerCase().includes(term) ||
          user.last_name?.toLowerCase().includes(term)
        );
      }
      
      if (roleFilter) {
        filteredUsers = filteredUsers.filter((user: User) => {
          const userRoleId = (user as any).role_id || user.role;
          return String(userRoleId) === roleFilter;
        });
      }
      
      setUsers(filteredUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      notifySuccess('Usuario eliminado exitosamente');
      await refreshUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      notifyError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: number, userData: Partial<CreateUserRequest>) => {
    try {
      await userService.updateUser(id, userData);
      notifySuccess('Usuario actualizado exitosamente');
      await refreshUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      notifyError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  // Calculate pagination
  const totalCount = users.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return {
    users: paginatedUsers,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount,
      itemsPerPage,
    },
    searchTerm,
    roleFilter,
    setSearchTerm,
    setRoleFilter,
    setCurrentPage,
    refreshUsers,
    deleteUser,
    updateUser,
  };
};
