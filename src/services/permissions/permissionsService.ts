// src/services/permissions/permissionsService.ts
import {
  Student,
  StudentsListResponse,
  UpdateStudentPermissionsRequest,
  CreateStudentRequest,
  StudentFilters,
  StudentStats,
} from "../../types/permissions";

// Mock data for development
const mockStudents: Student[] = [
  {
    id: 1,
    name: "Alumno 1",
    email: "alumno@unison.mx",
    status: "active",
    isActive: true,
    permissions: {
      canRead: true,
      canWrite: false,
      canDelete: false,
      canManageProjects: false,
      canViewReports: true,
      canExport: false,
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Alumno 2",
    email: "alumno@unison.mx",
    status: "no_project",
    isActive: true,
    permissions: {
      canRead: true,
      canWrite: false,
      canDelete: false,
      canManageProjects: false,
      canViewReports: false,
      canExport: false,
    },
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: 3,
    name: "Alumno 3",
    email: "alumno@unison.mx",
    status: "active",
    isActive: true,
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: false,
      canManageProjects: false,
      canViewReports: true,
      canExport: true,
    },
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
  },
  {
    id: 4,
    name: "Alumno 4",
    email: "alumno@unison.mx",
    status: "active",
    isActive: true,
    permissions: {
      canRead: true,
      canWrite: false,
      canDelete: false,
      canManageProjects: false,
      canViewReports: true,
      canExport: false,
    },
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-12T11:45:00Z",
  },
  {
    id: 5,
    name: "Alumno 5",
    email: "alumno@unison.mx",
    status: "inactive",
    isActive: false,
    permissions: {
      canRead: false,
      canWrite: false,
      canDelete: false,
      canManageProjects: false,
      canViewReports: false,
      canExport: false,
    },
    createdAt: "2024-01-11T16:10:00Z",
    updatedAt: "2024-01-11T16:10:00Z",
  },
  {
    id: 6,
    name: "Alumno 6",
    email: "alumno@unison.mx",
    status: "active",
    isActive: true,
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: true,
      canManageProjects: true,
      canViewReports: true,
      canExport: true,
    },
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-01-10T08:30:00Z",
  },
];

class PermissionsService {
  private students: Student[] = [...mockStudents];

  async getStudents(filters?: StudentFilters): Promise<StudentsListResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredStudents = [...this.students];

      // Apply filters
      if (filters?.status) {
        filteredStudents = filteredStudents.filter(
          (s) => s.status === filters.status,
        );
      }

      if (filters?.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredStudents = filteredStudents.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term),
        );
      }

      if (filters?.isActive !== undefined) {
        filteredStudents = filteredStudents.filter(
          (s) => s.isActive === filters.isActive,
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        filteredStudents.sort((a, b) => {
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
        students: filteredStudents,
        total: filteredStudents.length,
        page: 1,
        limit: 50,
      };
    } catch (error) {
      console.error("Error fetching students:", error);
      throw new Error("Failed to fetch students");
    }
  }

  async getStudentById(id: number): Promise<Student> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const student = this.students.find((s) => s.id === id);
      if (!student) {
        throw new Error("Student not found");
      }

      return student;
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  }

  async updateStudentPermissions(
    request: UpdateStudentPermissionsRequest,
  ): Promise<Student> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const studentIndex = this.students.findIndex(
        (s) => s.id === request.studentId,
      );
      if (studentIndex === -1) {
        throw new Error("Student not found");
      }

      this.students[studentIndex] = {
        ...this.students[studentIndex],
        permissions: request.permissions,
        updatedAt: new Date().toISOString(),
      };

      return this.students[studentIndex];
    } catch (error) {
      console.error("Error updating student permissions:", error);
      throw error;
    }
  }

  async deleteStudent(id: number): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const studentIndex = this.students.findIndex((s) => s.id === id);
      if (studentIndex === -1) {
        throw new Error("Student not found");
      }

      this.students.splice(studentIndex, 1);
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }

  async createStudent(request: CreateStudentRequest): Promise<Student> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newStudent: Student = {
        id: Math.max(...this.students.map((s) => s.id)) + 1,
        ...request,
        isActive: request.status !== "inactive",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.students.push(newStudent);
      return newStudent;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  async getStudentStats(): Promise<StudentStats> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        totalStudents: this.students.length,
        activeStudents: this.students.filter((s) => s.status === "active")
          .length,
        inactiveStudents: this.students.filter((s) => s.status === "inactive")
          .length,
        studentsWithoutProject: this.students.filter(
          (s) => s.status === "no_project",
        ).length,
      };
    } catch (error) {
      console.error("Error fetching student stats:", error);
      throw error;
    }
  }
}

export const permissionsService = new PermissionsService();
