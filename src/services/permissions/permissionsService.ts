// src/services/permissions/permissionsService.ts
import {
  User,
  UsersListResponse,
  CreateUserRequest,
  UserFilters,
  UserStats,
} from "../../types/permissions";

// Mock data for development
const mockUsers: User[] = [
  {
    id: 1,
    name: "Usuario 1",
    email: "usuario@unison.mx",
    status: "active",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Usuario 2",
    email: "usuario@unison.mx",
    status: "no_project",
    isActive: true,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: 3,
    name: "Usuario 3",
    email: "usuario@unison.mx",
    status: "active",
    isActive: true,
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
  },
  {
    id: 4,
    name: "Usuario 4",
    email: "usuario@unison.mx",
    status: "active",
    isActive: true,
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-12T11:45:00Z",
  },
  {
    id: 5,
    name: "Usuario 5",
    email: "usuario@unison.mx",
    status: "inactive",
    isActive: false,
    createdAt: "2024-01-11T16:10:00Z",
    updatedAt: "2024-01-11T16:10:00Z",
  },
  {
    id: 6,
    name: "Usuario 6",
    email: "usuario@unison.mx",
    status: "active",
    isActive: true,
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-01-10T08:30:00Z",
  },
];

class PermissionsService {
  private users: User[] = [...mockUsers];

  async getUsers(filters?: UserFilters): Promise<UsersListResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredUsers = [...this.users];

      // Apply filters
      if (filters?.status) {
        filteredUsers = filteredUsers.filter(
          (u) => u.status === filters.status,
        );
      }

      if (filters?.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term),
        );
      }

      if (filters?.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(
          (u) => u.isActive === filters.isActive,
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        filteredUsers.sort((a, b) => {
          const order = filters.sortOrder === "desc" ? -1 : 1;
          const aValue = a[filters.sortBy!];
          const bValue = b[filters.sortBy!];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return order * aValue.localeCompare(bValue);
          }

          return order * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
        });
      }

      return {
        users: filteredUsers,
        total: filteredUsers.length,
        page: 1,
        limit: 50,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const user = this.users.find((u) => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userIndex = this.users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      this.users.splice(userIndex, 1);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser: User = {
        id: Math.max(...this.users.map((u) => u.id)) + 1,
        ...request,
        isActive: request.status !== "inactive",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.users.push(newUser);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        totalUsers: this.users.length,
        activeUsers: this.users.filter((u) => u.status === "active")
          .length,
        inactiveUsers: this.users.filter((u) => u.status === "inactive")
          .length,
        usersWithFullPermissions: 0, // This is now deprecated
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  }
}

export const permissionsService = new PermissionsService();
