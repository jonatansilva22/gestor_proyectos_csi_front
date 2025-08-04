// src/components/permissions/BackendPermissionsModal.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  UserPermissionResponse, 
  Permission,
  ContentType
} from '../../types/backend-permissions';
import { backendPermissionsService } from '../../services/permissions/backendPermissionsService';

interface BackendPermissionsModalProps {
  userId: number | null;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (permissions: UserPermissionResponse) => void;
}

/**
 * Función para obtener descripción de permisos en español
 */
const getPermissionDescription = (codename: string): string => {
  const descriptions: Record<string, string> = {
    // Permisos de Proyectos CSI
    'view_project': 'Acceso de solo lectura a información de proyectos, incluye descripción, objetivos y progreso',
    'add_project': 'Capacidad para registrar y documentar nuevos proyectos de investigación o desarrollo',
    'change_project': 'Edición de metadatos, objetivos, descripción y estado de proyectos existentes',
    'delete_project': 'Eliminación definitiva de proyectos del sistema (acción irreversible)',
    
    // Permisos de Áreas de Conocimiento
    'view_area': 'Consulta de áreas temáticas y disciplinas académicas disponibles',
    'add_area': 'Creación de nuevas áreas de conocimiento o especialización',
    'change_area': 'Modificación de definiciones y características de áreas existentes',
    'delete_area': 'Eliminación de áreas de conocimiento del catálogo',
    
    // Permisos de Estudiantes y Usuarios
    'view_user': 'Acceso a perfiles, información académica y datos de contacto de estudiantes',
    'add_user': 'Registro de nuevos estudiantes en el sistema con sus datos académicos',
    'change_user': 'Actualización de información personal, académica y de contacto',
    'delete_user': 'Dar de baja definitivamente a estudiantes del sistema',
    
    // Permisos de Repositorios de Código
    'view_repository': 'Acceso a información de repositorios, enlaces y documentación técnica',
    'add_repository': 'Registro de nuevos repositorios de código y documentación técnica',
    'change_repository': 'Actualización de enlaces, descripción y metadatos de repositorios',
    'delete_repository': 'Eliminación de registros de repositorios del sistema',
    
    // Permisos de Herramientas de Desarrollo
    'view_tool': 'Consulta del catálogo de herramientas, tecnologías y frameworks disponibles',
    'add_tool': 'Incorporación de nuevas herramientas al catálogo tecnológico',
    'change_tool': 'Actualización de información, versiones y características de herramientas',
    'delete_tool': 'Retiro de herramientas obsoletas del catálogo',
    
    // ========== PERMISOS ORGANIZACIONALES Y DE CONFIGURACIÓN ==========
    
    // Permisos de Roles Académicos
    'view_roletype': 'Consulta de roles disponibles: estudiante, docente, investigador, coordinador',
    'add_roletype': 'Definición de nuevos roles académicos según necesidades institucionales',
    'change_roletype': 'Actualización de permisos y responsabilidades de roles existentes',
    'delete_roletype': 'Eliminación de roles académicos obsoletos o no utilizados',
    
    // Permisos de Estados de Proyecto
    'view_statustype': 'Visualización de estados: propuesto, en desarrollo, completado, cancelado',
    'add_statustype': 'Creación de estados personalizados para el flujo de proyectos',
    'change_statustype': 'Modificación de definiciones y criterios de estados existentes',
    'delete_statustype': 'Eliminación de estados de proyecto no utilizados',
    
    // Permisos de Equipos de Trabajo
    'view_workgroup': 'Acceso a información de equipos, integrantes y proyectos asignados',
    'add_workgroup': 'Formación de nuevos equipos multidisciplinarios para proyectos',
    'change_workgroup': 'Reorganización de equipos, cambio de líderes y objetivos',
    'delete_workgroup': 'Disolución de equipos completados o inactivos',
    
    // Permisos de Participación en Equipos
    'view_workgroupmembership': 'Consulta de participación y roles dentro de equipos de trabajo',
    'add_workgroupmembership': 'Incorporación de estudiantes a equipos de trabajo existentes',
    'change_workgroupmembership': 'Modificación de roles y responsabilidades dentro del equipo',
    'delete_workgroupmembership': 'Remoción de participantes de equipos de trabajo',
    
    // Permisos de Clasificación de Proyectos
    'view_areaproject': 'Visualización de la clasificación temática y disciplinar de proyectos',
    'add_areaproject': 'Asignación de proyectos a áreas de conocimiento específicas',
    'change_areaproject': 'Reclasificación de proyectos en diferentes áreas temáticas',
    'delete_areaproject': 'Remoción de clasificaciones temáticas de proyectos',
    
    // Permisos de Stack Tecnológico
    'view_toolproject': 'Consulta de tecnologías, frameworks y herramientas utilizadas',
    'add_toolproject': 'Documentación del stack tecnológico de proyectos',
    'change_toolproject': 'Actualización de tecnologías y versiones utilizadas',
    'delete_toolproject': 'Remoción de tecnologías obsoletas del registro del proyecto',
    
    // Permisos de Administración del Sistema
    'view_permission': 'Auditoría y consulta de la matriz de permisos del sistema',
    'add_permission': 'Creación de permisos personalizados para necesidades específicas',
    'change_permission': 'Configuración y ajuste de permisos existentes del sistema',
    'delete_permission': 'Revocación y eliminación de permisos del sistema',
    
    // Permisos de Control de Acceso Granular
    'view_userobjectpermission': 'Consulta de permisos específicos sobre elementos individuales',
    'add_userobjectpermission': 'Asignación de permisos granulares sobre objetos particulares',
    'change_userobjectpermission': 'Modificación de permisos específicos ya asignados',
    'delete_userobjectpermission': 'Revocación de permisos específicos sobre objetos',
    
    // Permisos de Control de Acceso General
    'view_usermodelpermission': 'Visualización de permisos generales sobre módulos completos',
    'add_usermodelpermission': 'Asignación de permisos amplios sobre categorías de contenido',
    'change_usermodelpermission': 'Ajuste de permisos generales ya configurados',
    'delete_usermodelpermission': 'Revocación de permisos generales de módulos'
  };
  
  return descriptions[codename] || '';
};

export const BackendPermissionsModal: React.FC<BackendPermissionsModalProps> = ({
  userId,
  userName,
  isOpen,
  onClose,
  onSave,
}) => {
  const { darkMode } = useTheme();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('Modal opened:', { isOpen, userId, userName });
    if (isOpen && userId) {
      loadData();
    }
  }, [isOpen, userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading permissions data for user:', userId);
      
      // Usar datos mock si el servicio falla
      let permsData, contentTypesData, userPermsData;
      
      try {
        [permsData, contentTypesData, userPermsData] = await Promise.all([
          backendPermissionsService.getAllPermissions(),
          backendPermissionsService.getContentTypes(),
          backendPermissionsService.getUserPermissions(userId!),
        ]);
      } catch (serviceError) {
        console.warn('Service failed, using mock data:', serviceError);
        
        // Datos mock para demostración con TODOS los permisos del backend
        permsData = [
          // Proyectos CSI
          { id: 1, name: 'Consultar proyectos y su información', codename: 'view_project', content_type: 1 },
          { id: 2, name: 'Registrar nuevos proyectos CSI', codename: 'add_project', content_type: 1 },
          { id: 3, name: 'Editar información de proyectos', codename: 'change_project', content_type: 1 },
          { id: 4, name: 'Eliminar proyectos del sistema', codename: 'delete_project', content_type: 1 },
          
          // Áreas de Conocimiento
          { id: 5, name: 'Consultar áreas de conocimiento', codename: 'view_area', content_type: 2 },
          { id: 6, name: 'Crear nuevas áreas de conocimiento', codename: 'add_area', content_type: 2 },
          { id: 7, name: 'Modificar áreas de conocimiento', codename: 'change_area', content_type: 2 },
          { id: 8, name: 'Eliminar áreas de conocimiento', codename: 'delete_area', content_type: 2 },
          
          // Estudiantes y Usuarios
          { id: 9, name: 'Ver perfiles de estudiantes', codename: 'view_user', content_type: 3 },
          { id: 10, name: 'Registrar nuevos estudiantes', codename: 'add_user', content_type: 3 },
          { id: 11, name: 'Actualizar datos de estudiantes', codename: 'change_user', content_type: 3 },
          { id: 12, name: 'Dar de baja estudiantes', codename: 'delete_user', content_type: 3 },
          
          // Repositorios de Código
          { id: 13, name: 'Acceder a repositorios de código', codename: 'view_repository', content_type: 4 },
          { id: 14, name: 'Crear nuevos repositorios', codename: 'add_repository', content_type: 4 },
          { id: 15, name: 'Modificar configuración de repositorios', codename: 'change_repository', content_type: 4 },
          { id: 16, name: 'Eliminar repositorios', codename: 'delete_repository', content_type: 4 },
          
          // Herramientas de Desarrollo
          { id: 17, name: 'Ver catálogo de herramientas', codename: 'view_tool', content_type: 5 },
          { id: 18, name: 'Agregar herramientas al catálogo', codename: 'add_tool', content_type: 5 },
          { id: 19, name: 'Actualizar información de herramientas', codename: 'change_tool', content_type: 5 },
          { id: 20, name: 'Retirar herramientas del catálogo', codename: 'delete_tool', content_type: 5 },
          
          // Roles Académicos
          { id: 21, name: 'Consultar roles académicos disponibles', codename: 'view_roletype', content_type: 6 },
          { id: 22, name: 'Definir nuevos roles académicos', codename: 'add_roletype', content_type: 6 },
          { id: 23, name: 'Modificar roles académicos existentes', codename: 'change_roletype', content_type: 6 },
          { id: 24, name: 'Eliminar roles académicos', codename: 'delete_roletype', content_type: 6 },
          
          // Estados de Proyecto
          { id: 25, name: 'Ver estados de proyecto', codename: 'view_statustype', content_type: 7 },
          { id: 26, name: 'Crear estados de proyecto personalizados', codename: 'add_statustype', content_type: 7 },
          { id: 27, name: 'Editar estados de proyecto', codename: 'change_statustype', content_type: 7 },
          { id: 28, name: 'Eliminar estados de proyecto', codename: 'delete_statustype', content_type: 7 },
          
          // Equipos de Trabajo
          { id: 29, name: 'Ver equipos de trabajo activos', codename: 'view_workgroup', content_type: 8 },
          { id: 30, name: 'Formar nuevos equipos de trabajo', codename: 'add_workgroup', content_type: 8 },
          { id: 31, name: 'Reorganizar equipos de trabajo', codename: 'change_workgroup', content_type: 8 },
          { id: 32, name: 'Disolver equipos de trabajo', codename: 'delete_workgroup', content_type: 8 },
          
          // Participación en Equipos
          { id: 33, name: 'Ver participantes de equipos', codename: 'view_workgroupmembership', content_type: 9 },
          { id: 34, name: 'Agregar estudiantes a equipos', codename: 'add_workgroupmembership', content_type: 9 },
          { id: 35, name: 'Cambiar participación en equipos', codename: 'change_workgroupmembership', content_type: 9 },
          { id: 36, name: 'Remover estudiantes de equipos', codename: 'delete_workgroupmembership', content_type: 9 },
          
          // Clasificación de Proyectos
          { id: 37, name: 'Ver clasificación por áreas', codename: 'view_areaproject', content_type: 10 },
          { id: 38, name: 'Clasificar proyectos por área', codename: 'add_areaproject', content_type: 10 },
          { id: 39, name: 'Reclasificar proyectos', codename: 'change_areaproject', content_type: 10 },
          { id: 40, name: 'Quitar clasificación de área', codename: 'delete_areaproject', content_type: 10 },
          
          // Stack Tecnológico
          { id: 41, name: 'Ver tecnologías de proyectos', codename: 'view_toolproject', content_type: 11 },
          { id: 42, name: 'Asignar tecnologías a proyectos', codename: 'add_toolproject', content_type: 11 },
          { id: 43, name: 'Actualizar stack tecnológico', codename: 'change_toolproject', content_type: 11 },
          { id: 44, name: 'Remover tecnologías de proyectos', codename: 'delete_toolproject', content_type: 11 },
          
          // Administración de Permisos
          { id: 45, name: 'Auditar permisos del sistema', codename: 'view_permission', content_type: 12 },
          { id: 46, name: 'Crear permisos personalizados', codename: 'add_permission', content_type: 12 },
          { id: 47, name: 'Configurar permisos existentes', codename: 'change_permission', content_type: 12 },
          { id: 48, name: 'Revocar permisos del sistema', codename: 'delete_permission', content_type: 12 },
          
          // Permisos Específicos
          { id: 49, name: 'Ver permisos específicos por objeto', codename: 'view_userobjectpermission', content_type: 13 },
          { id: 50, name: 'Asignar permisos específicos', codename: 'add_userobjectpermission', content_type: 13 },
          { id: 51, name: 'Modificar permisos específicos', codename: 'change_userobjectpermission', content_type: 13 },
          { id: 52, name: 'Revocar permisos específicos', codename: 'delete_userobjectpermission', content_type: 13 },
          
          // Permisos Generales
          { id: 53, name: 'Ver permisos generales de módulos', codename: 'view_usermodelpermission', content_type: 14 },
          { id: 54, name: 'Asignar permisos generales', codename: 'add_usermodelpermission', content_type: 14 },
          { id: 55, name: 'Modificar permisos generales', codename: 'change_usermodelpermission', content_type: 14 },
          { id: 56, name: 'Revocar permisos generales', codename: 'delete_usermodelpermission', content_type: 14 },
        ];
        
        contentTypesData = [
          // Categorías principales
          { id: 1, model: 'project', app_label: 'projects' },
          { id: 2, model: 'area', app_label: 'areas' },
          { id: 3, model: 'user', app_label: 'users' },
          { id: 4, model: 'repository', app_label: 'repositories' },
          { id: 5, model: 'tool', app_label: 'tools' },
          
          // Nuevas categorías del backend
          { id: 6, model: 'roletype', app_label: 'users' },
          { id: 7, model: 'statustype', app_label: 'projects' },
          { id: 8, model: 'workgroup', app_label: 'workgroups' },
          { id: 9, model: 'workgroupmembership', app_label: 'workgroups' },
          { id: 10, model: 'areaproject', app_label: 'areas' },
          { id: 11, model: 'toolproject', app_label: 'tools' },
          { id: 12, model: 'permission', app_label: 'permissions' },
          { id: 13, model: 'userobjectpermission', app_label: 'permissions' },
          { id: 14, model: 'usermodelpermission', app_label: 'permissions' },
        ];
        
        userPermsData = {
          user_id: userId!,
          model_permissions: [],
          object_permissions: []
        };
      }

      console.log('Loaded data:', { permsData, contentTypesData, userPermsData });
      
      setPermissions(permsData);
      setContentTypes(contentTypesData);
      setUserPermissions(userPermsData);

      // Set currently assigned permissions
      const currentPermissions = new Set<string>();
      userPermsData.model_permissions.forEach(mp => {
        currentPermissions.add(`${mp.content_type.model}.${mp.permission.codename}`);
      });
      userPermsData.object_permissions.forEach(op => {
        currentPermissions.add(`${op.content_type.model}.${op.permission.codename}.${op.object_pk}`);
      });
      setSelectedPermissions(currentPermissions);

    } catch (error) {
      console.error('Error loading permissions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionKey: string, isChecked: boolean) => {
    const newSelected = new Set(selectedPermissions);
    if (isChecked) {
      newSelected.add(permissionKey);
    } else {
      newSelected.delete(permissionKey);
    }
    setSelectedPermissions(newSelected);
  };

  /**
   * Manejar selección/deselección de toda una categoría
   */
  const handleCategoryToggle = (contentType: string, perms: Permission[]) => {
    const newSelected = new Set(selectedPermissions);
    const categoryState = getCategorySelectionState(contentType, perms);
    
    if (categoryState === 'all') {
      // Deseleccionar todos los permisos de esta categoría
      perms.forEach(perm => {
        newSelected.delete(`${contentType}.${perm.codename}`);
      });
    } else {
      // Seleccionar todos los permisos de esta categoría
      perms.forEach(perm => {
        newSelected.add(`${contentType}.${perm.codename}`);
      });
    }
    
    setSelectedPermissions(newSelected);
  };
  
  /**
   * Obtener el estado de selección de una categoría
   */
  const getCategorySelectionState = (contentType: string, perms: Permission[]): 'all' | 'some' | 'none' => {
    const selectedInCategory = perms.filter(perm => 
      selectedPermissions.has(`${contentType}.${perm.codename}`)
    ).length;
    
    if (selectedInCategory === perms.length) return 'all';
    if (selectedInCategory > 0) return 'some';
    return 'none';
  };

  const handleSave = async () => {
    if (!userId || !userPermissions) return;

    setLoading(true);
    try {
      // Calculate changes needed
      const currentPermissions = new Set<string>();
      userPermissions.model_permissions.forEach(mp => {
        currentPermissions.add(`${mp.content_type.model}.${mp.permission.codename}`);
      });

      // Permissions to add
      const toAdd = Array.from(selectedPermissions).filter(p => !currentPermissions.has(p));
      
      // Permissions to remove
      const toRemove = Array.from(currentPermissions).filter(p => !selectedPermissions.has(p));

      // Apply changes
      for (const permKey of toAdd) {
        const [contentType, codename] = permKey.split('.');
        await backendPermissionsService.assignPermission({
          user_id: userId,
          permission_codename: codename,
          content_type: contentType,
        });
      }

      for (const permKey of toRemove) {
        const [contentType, codename] = permKey.split('.');
        await backendPermissionsService.removePermission({
          user_id: userId,
          permission_codename: codename,
          content_type: contentType,
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }
  
  console.log('Rendering modal with data:', { permissions, contentTypes, loading });

  const groupedPermissions = contentTypes.reduce((acc, ct) => {
    acc[ct.model] = permissions.filter(p => p.content_type === ct.id);
    return acc;
  }, {} as Record<string, Permission[]>);
  
  // Mapeo de nombres de modelos a títulos contextuales del proyecto CSI
  const modelTitles: Record<string, string> = {
    // 📚 Categorías principales del sistema CSI
    'project': 'Proyectos CSI',
    'area': 'Áreas', 
    'user': 'Usuarios',
    'repository': 'Repositorios',
    'tool': 'Herramientas',
    'permission': 'Administración de Permisos (permisos del sistema)',
    
    // 🏛️ Categorías organizacionales
    'roletype': 'Roles',
    'statustype': 'Estados de Proyecto',
    'workgroup': 'Grupos de Trabajo',
    'workgroupmembership': 'Participación en Equipos',
    
    // 📊 Categorías de clasificación
    'areaproject': 'Clasificación de Proyectos',
    'toolproject': 'Stack Tecnológico',
    
    // 🔐 Categorías de control de acceso
    'userobjectpermission': 'Permisos Específicos (permisos por objeto)',
    'usermodelpermission': 'Permisos Generales (por modelo)',
    
    // Fallbacks
    'contenttype': 'Tipos de Contenido',
    'group': 'Grupos del Sistema'
  };
  
  // Ordenar las categorías por prioridad (principales primero, luego las nuevas)
  const categoryOrder = [
    // Categorías principales
    'project', 'area', 'user', 'repository', 'tool',
    // Nuevas categorías del backend
    'roletype', 'statustype', 'workgroup', 'workgroupmembership',
    'areaproject', 'toolproject',
    // Permisos y sistema
    'permission', 'userobjectpermission', 'usermodelpermission',
    // Fallbacks
    'contenttype', 'group'
  ];
  const sortedCategories = Object.keys(groupedPermissions).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        // Solo cerrar si se hace click en el overlay, no en el modal
        if (e.target === e.currentTarget) {
          console.log('Closing modal via overlay click');
          onClose();
        }
      }}
    >
      <div className={`w-full max-w-4xl max-h-[90vh] mx-4 rounded-lg shadow-xl overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Permisos del Sistema para {userName}
            </h3>
            <button
              onClick={onClose}
              className={`text-gray-400 hover:text-gray-600 ${darkMode ? "hover:text-gray-300" : ""}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cargando permisos...</span>
            </div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No se pudieron cargar los permisos. Usando datos de demostración.
              </p>
              <button
                onClick={loadData}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCategories.map((contentType) => {
                const perms = groupedPermissions[contentType];
                if (!perms || perms.length === 0) return null;
                
                return (
                <div key={contentType} className={`border rounded-lg p-4 ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-md font-semibold capitalize ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {modelTitles[contentType] || contentType}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                      }`}>
                        {perms.length} permisos
                      </span>
                      <button
                        onClick={() => handleCategoryToggle(contentType, perms)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          darkMode 
                            ? "bg-purple-700 hover:bg-purple-600 text-white" 
                            : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                        }`}
                      >
                        {getCategorySelectionState(contentType, perms) === 'all' ? 'Deseleccionar' : 'Seleccionar'} Todo
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {perms.map((permission) => {
                      const permissionKey = `${contentType}.${permission.codename}`;
                      const isChecked = selectedPermissions.has(permissionKey);
                      
                      return (
                        <div 
                          key={permission.id}
                          className={`border rounded-lg p-3 transition-colors ${
                            isChecked 
                              ? darkMode ? "border-purple-500 bg-purple-900/20" : "border-purple-500 bg-purple-50"
                              : darkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handlePermissionToggle(permissionKey, e.target.checked)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                            />
                            <div className="flex flex-col flex-1">
                              <span className={`text-sm font-medium ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                {permission.name}
                              </span>
                              <span className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}>
                                Código: {permission.codename}
                              </span>
                              {getPermissionDescription(permission.codename) && (
                                <span className={`text-xs mt-1 italic ${
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }`}>
                                  {getPermissionDescription(permission.codename)}
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex justify-end space-x-3`}>
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};