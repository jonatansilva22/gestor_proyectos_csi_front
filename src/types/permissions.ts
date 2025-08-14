// src/types/permissions.ts
// 🔐 ONLY types related to PERMISSIONS MANAGEMENT

export interface Student {
  id: number;
  name: string;
  email: string;
  status: StudentStatus;
  isActive: boolean;
  permissions: StudentPermissions;
  createdAt: string;
  updatedAt: string;
}

export type StudentStatus = "active" | "inactive" | "no_project";

export interface StudentPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManageProjects: boolean;
  canViewReports: boolean;
  canExport: boolean;
}

export interface StudentsListResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateStudentPermissionsRequest {
  studentId: number;
  permissions: StudentPermissions;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  status: StudentStatus;
  permissions: StudentPermissions;
}

export interface StudentFilters {
  status?: StudentStatus;
  searchTerm?: string;
  isActive?: boolean;
  sortBy?: "name" | "email" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  studentsWithoutProject: number;
}

// Permission templates for quick assignment
export const PERMISSION_TEMPLATES = {
  readonly: {
    canRead: true,
    canWrite: false,
    canDelete: false,
    canManageProjects: false,
    canViewReports: true,
    canExport: false,
  },
  editor: {
    canRead: true,
    canWrite: true,
    canDelete: false,
    canManageProjects: false,
    canViewReports: true,
    canExport: true,
  },
  admin: {
    canRead: true,
    canWrite: true,
    canDelete: true,
    canManageProjects: true,
    canViewReports: true,
    canExport: true,
  },
} as const;

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  no_project: "Sin Proyecto",
};

export const STUDENT_STATUS_COLORS: Record<StudentStatus, string> = {
  active: "text-green-500",
  inactive: "text-gray-500",
  no_project: "text-red-500",
};
