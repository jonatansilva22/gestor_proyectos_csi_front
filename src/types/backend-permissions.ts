// Types for backend permissions compatibility

export interface ModelPermission {
  id: number;
  name: string;
  contentType: string;
  codename: string;
}

export interface ObjectPermission {
  id: number;
  permission: ModelPermission;
  objectId: number;
  contentType: string;
  objectRepr?: string;
}

export interface UserPermissionResponse {
  id: number;
  username: string;
  email: string;
  model_permissions: ModelPermission[];
  object_permissions: ObjectPermission[];
}

export interface BackendPermissionsModalProps {
  userId: number;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (permissions: UserPermissionResponse) => void;
}

export interface PermissionCheckRequest {
  user_id: number;
  permission_codename: string;
  content_type?: string;
  object_id?: number;
}

export interface PermissionAssignmentRequest {
  user_id: number;
  permission_codename: string;
  content_type?: string;
  object_id?: number;
}

export interface BulkPermissionRequest {
  user_ids: number[];
  permissions: string[];
  action: 'add' | 'remove';
  content_type?: string;
  object_ids?: number[];
}

export interface Permission {
  id: number;
  codename: string;
  name: string;
  content_type: string;
}

export interface ContentType {
  id: number;
  app_label: string;
  model: string;
}