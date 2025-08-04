// src/types/permissions/backend.ts
import { UserPermissions } from '../auth';

export interface UserPermissionResponse extends UserPermissions {
  userId: number;
  userName: string;
  userEmail: string;
}

export interface PermissionRequest {
  permission: string;
  contentType?: string;
  objectId?: number;
}

export interface BulkPermissionRequest {
  userId: number;
  permissions: PermissionRequest[];
}

export interface PermissionCheckResponse {
  hasPermission: boolean;
  reason?: string;
}