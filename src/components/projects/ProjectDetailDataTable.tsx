import { Project } from "../../types/projects/Project";
import { PROJECT_ICONS } from "../../const/projectIcons"; 
import { DataRow } from "./DataRow";
import { updateProject } from "../../services/projects/projectService";
import { notifySuccess, notifyError } from "../common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import { formatDate } from "../../utils/projects/formatDate";
import { getDateInputValue } from "../../utils/projects/dateHelpers";
import { useGroupsOptions } from "../../hooks/projects/useGroupsOptions";
import { useAreasOptions } from "../../hooks/projects/useAreasOptions";
import { useToolsOptions } from "../../hooks/projects/useToolsOptions";
import { useRepositoriesOptions } from "../../hooks/projects/useRepositoriesOptions";
import { useStatusOptions } from "../../hooks/projects/useStatusOptions";
import { PROJECT_STATUS_COLORS_TEXT } from "../../const/projectsStatusColors";
import { getProjectById } from "../../services/projects/projectService";
import { toMediaUrl } from "../../utils/media";
import { useTheme } from "../../context/ThemeContext";
import { ROLE_NAMES } from "../../const/index";

interface ProjectDataTableProps {
  project: Project;
  onProjectUpdate: (p: Project) => void;
}

export const ProjectDataTable = ({
  project,
  onProjectUpdate,
}: ProjectDataTableProps) => {
  const { darkMode } = useTheme();
  const groupsOptions = useGroupsOptions();
  const areasOptions = useAreasOptions();
  const toolsOptions = useToolsOptions();
  const repositoriesOptions = useRepositoriesOptions();
  const statusOptions = useStatusOptions();

  // Helper function to get group name - simplified
  const getGroupName = () => {
    if (project.group && typeof project.group === 'object' && project.group.name) {
      return project.group.name;
    }
    return "Sin grupo";
  };

  // Helper function to get group value for editing - simplified
  const getGroupValue = () => {
    if (project.group && typeof project.group === 'object' && project.group.id) {
      return project.group.id.toString();
    }
    return "";
  };

  // Function to refresh full project data after group change
  const refreshProjectData = async () => {
    try {
      const updatedProject = await getProjectById(project.id);
      onProjectUpdate(updatedProject);
    } catch (error) {
      console.error('Error refreshing project data:', error);
    }
  };

  return (
    <div>
      <div className={`font-semibold text-center mb-2 pb-3 ${
        darkMode ? 'text-purple-300' : 'text-gray-900'
      }`}>
        Datos del proyecto
      </div>
      <div className={`border-t border-b divide-y ${
        darkMode 
          ? 'border-purple-700 divide-purple-700' 
          : 'border-gray-200 divide-gray-200'
      }`}>
        <DataRow
          label="Grupo"
          value={getGroupValue()}
          icon={PROJECT_ICONS["Grupo"]}
          editable
          inputType="select"
          options={groupsOptions}
          onSave={async (newGroupId) => {
            try {
              await updateProject(project.id, {
                group_id: Number(newGroupId),
              });
              // Refresh full project data to get updated participants
              await refreshProjectData();
              notifySuccess("Grupo actualizado y participantes actualizados");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() => getGroupName()}
        />
        
        <DataRow
          label="Estado"
          value={project.status?.id?.toString() || ""}
          icon={PROJECT_ICONS["Estado del proyecto"]}
          editable
          inputType="select"
          options={statusOptions}
          onSave={async (newStatusId) => {
            try {
              const updated = await updateProject(project.id, {
                status_id: Number(newStatusId),
              });
              onProjectUpdate(updated);
              notifySuccess("Estado actualizado");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() => {
            const statusName = project.status?.name;
            if (!statusName) return "Sin estado";
            
            const textColor = PROJECT_STATUS_COLORS_TEXT[statusName] || 'text-gray-700';
            const getBgColor = (status: string) => {
              if (darkMode) {
                switch(status) {
                  case 'Activo': return 'bg-green-900/30';
                  case 'Inactivo': return 'bg-yellow-900/30';
                  case 'Completado': return 'bg-blue-900/30';
                  default: return 'bg-gray-700/30';
                }
              } else {
                switch(status) {
                  case 'Activo': return 'bg-green-100';
                  case 'Inactivo': return 'bg-yellow-100';
                  case 'Completado': return 'bg-blue-100';
                  default: return 'bg-gray-100';
                }
              }
            };
            
            return (
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${textColor} ${getBgColor(statusName)}`}>
                {statusName}
              </span>
            );
          }}
        />
        <DataRow
          label="Colaboradores"
          value={project.users?.map((u: any) => u.id.toString()) || []}
          icon={PROJECT_ICONS["Colaboradores"]}
          renderDisplay={() => {
            // Mostrar colaboradores del grupo si existe, si no mostrar colaboradores del proyecto
            const collaborators = project.group && typeof project.group === 'object' && project.group.users 
              ? project.group.users 
              : project.users || [];
              
            return collaborators.length ? (
              <div className="flex flex-col gap-2">
                {collaborators.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3">
                    {user.photo ? (
                      <img
                        src={toMediaUrl(user.photo) || undefined}
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${ 
                        darkMode ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-purple-400 to-purple-600'
                      }`}>
                        {user.first_name && user.last_name 
                          ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
                          : user.username.substring(0, 2).toUpperCase()
                        }
                      </div>
                    )}
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-purple-200' : 'text-gray-900'
                        }`}>
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.username
                          }
                        </div>
                        {/* Mostrar rol del usuario */}
                        {(user.role || user.role_id) && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            (user.role || user.role_id) === 2 
                              ? (darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700')
                              : (user.role || user.role_id) === 1 
                              ? (darkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700')
                              : (darkMode ? 'bg-gray-700/40 text-gray-300' : 'bg-gray-100 text-gray-700')
                          }`}>
                            {(user.role || user.role_id) === 2 ? '👑' : (user.role || user.role_id) === 1 ? '🛠️' : '👤'} {ROLE_NAMES[(user.role || user.role_id) as keyof typeof ROLE_NAMES] || 'Usuario'}
                          </span>
                        )}
                      </div>
                      {user.first_name && user.last_name && (
                        <div className={`text-xs ${
                          darkMode ? 'text-purple-400' : 'text-gray-500'
                        }`}>
                          @{user.username}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className={darkMode ? 'text-purple-300' : 'text-gray-500'}>
                Sin colaboradores
              </span>
            );
          }}
        />

        <DataRow
          label="Áreas"
          value={project.areas?.map((a: any) => a.id.toString()) || []}
          icon={PROJECT_ICONS["Área"]}
          editable
          inputType="multiselect"
          options={areasOptions}
          onSave={async (newIds) => {
            try {
              const updated = await updateProject(project.id, {
                area_ids: Array.isArray(newIds) ? newIds.map(Number) : [],
              });
              onProjectUpdate(updated);
              notifySuccess("Áreas actualizadas");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() =>
            project.areas?.length ? (
              <div className="flex flex-col gap-1">
                {project.areas.map((a: any) => (
                  <div key={a.id}>{a.name}</div>
                ))}
              </div>
            ) : (
              "Sin áreas"
            )
          }
        />

        <DataRow
          label="Fecha de inicio"
          value={getDateInputValue(project.start_date)}
          icon={PROJECT_ICONS["Fecha de inicio"]}
          editable
          inputType="date"
          onSave={async (newDate) => {
            if (
              newDate &&
              project.end_date &&
              newDate > getDateInputValue(project.end_date)
            ) {
              notifyError(
                "La fecha de inicio no puede ser mayor que la fecha final"
              );
              return;
            }
            try {
              const updated = await updateProject(project.id, {
                start_date: newDate,
              });
              onProjectUpdate(updated);
              notifySuccess("Fecha actualizada");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={(val: string | string[]) => formatDate(val as string)}
        />
        <DataRow
          label="Fecha final estimada"
          value={getDateInputValue(project.end_date)}
          icon={PROJECT_ICONS["Fecha final estimada"]}
          editable
          inputType="date"
          onSave={async (newDate) => {
            if (
              newDate &&
              project.start_date &&
              newDate < getDateInputValue(project.start_date)
            ) {
              notifyError(
                "La fecha final no puede ser menor que la fecha de inicio"
              );
              return;
            }
            try {
              const updated = await updateProject(project.id, {
                end_date: newDate,
              });
              onProjectUpdate(updated);
              notifySuccess("Fecha actualizada");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={(val: string | string[]) => formatDate(val as string)}
        />
        <DataRow
          label="Herramientas"
          value={project.tools?.map((t: any) => t.id.toString()) || []}
          icon={PROJECT_ICONS["Herramientas"]}
          editable
          inputType="multiselect"
          options={toolsOptions}
          onSave={async (newIds) => {
            try {
              const updated = await updateProject(project.id, {
                tool_ids: Array.isArray(newIds) ? newIds.map(Number) : [],
              });
              onProjectUpdate(updated);
              notifySuccess("Herramientas actualizadas");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() =>
            project.tools?.length ? (
              <div className="flex flex-col gap-1">
                {project.tools.map((t: any) => (
                  <div key={t.id}>{t.name}</div>
                ))}
              </div>
            ) : (
              "Sin herramientas"
            )
          }
        />

        <DataRow
          label="Repositorios"
          value={project.repositories?.map((r: any) => r.id.toString()) || []}
          icon={PROJECT_ICONS["Repositorios"]}
          editable
          inputType="multiselect"
          options={repositoriesOptions}
          onSave={async (newIds) => {
            try {
              const updated = await updateProject(project.id, {
                repository_ids: Array.isArray(newIds) ? newIds.map(Number) : [],
              });
              onProjectUpdate(updated);
              notifySuccess("Repositorios actualizados");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() =>
            project.repositories?.length ? (
              <div className="flex flex-col gap-1">
                {project.repositories.map((r: any) => (
                  <a
                    key={r.id}
                    href={r.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={darkMode 
                      ? 'text-purple-400 underline hover:text-purple-300' 
                      : 'text-purple-600 underline hover:text-purple-800'
                    }
                  >
                    {r.name}
                  </a>
                ))}
              </div>
            ) : (
              "Sin repositorios"
            )
          }
        />
      </div>
    </div>
  );
};
