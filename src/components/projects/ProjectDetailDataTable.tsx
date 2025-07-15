import { Project } from "../../types/projects/Project";
import { PROJECT_STATUS_COLORS_BG } from "../../const/projectsStatusColors";
import { PROJECT_ICONS } from "../../const/projectIcons"; 
import { DataRow } from "./DataRow";
import { updateProject } from "../../services/projects/projectService";
import { notifySuccess, notifyError } from "../common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";
import { formatDate } from "../../utils/projects/formatDate";
import { getDateInputValue } from "../../utils/projects/dateHelpers";
import { useStatusOptions } from "../../hooks/projects/useStatusOptions";
import { useGroupsOptions } from "../../hooks/projects/useGroupsOptions";
import { useAreasOptions } from "../../hooks/projects/useAreasOptions";
import { useToolsOptions } from "../../hooks/projects/useToolsOptions";
import { useRepositoriesOptions } from "../../hooks/projects/useRepositoriesOptions";

interface ProjectDataTableProps {
  project: Project;
  onProjectUpdate: (p: Project) => void;
}

export const ProjectDataTable = ({
  project,
  onProjectUpdate,
}: ProjectDataTableProps) => {
  const statusOptions = useStatusOptions();
  const groupsOptions = useGroupsOptions();
  const areasOptions = useAreasOptions();
  const toolsOptions = useToolsOptions();
  const repositoriesOptions = useRepositoriesOptions();

  return (
    <div>
      <div className="font-semibold text-center mb-2 pb-3">
        Datos del proyecto
      </div>
      <div className="border-t border-b divide-y">
        <DataRow
          label="Grupo"
          value={project.group?.id.toString() || ""}
          icon={PROJECT_ICONS["Grupo"]}
          editable
          inputType="select"
          options={groupsOptions}
          onSave={async (newGroupId) => {
            try {
              const updated = await updateProject(project.id, {
                group_id: Number(newGroupId),
              });
              const selectedGroup = groupsOptions.find(
                (g) => g.value === newGroupId
              );
              onProjectUpdate({
                ...project,
                group: selectedGroup
                  ? {
                      id: Number(selectedGroup.value),
                      name: selectedGroup.label,
                    }
                  : null,
              });
              notifySuccess("Grupo actualizado");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() => project.group?.name || "Sin grupo"}
        />
        <DataRow
          label="Colaboradores"
          value={project.group?.users?.map((u) => u.id.toString()) || []}
          icon={PROJECT_ICONS["Colaboradores"]}
          renderDisplay={() =>
            project.group?.users?.length ? (
              <div className="flex flex-col gap-1">
                {project.group.users.map((u) => (
                  <div key={u.id}>{u.username}</div>
                ))}
              </div>
            ) : (
              "Sin colaboradores"
            )
          }
        />

        <DataRow
          label="Áreas"
          value={project.areas.map((a) => a.id.toString())}
          icon={PROJECT_ICONS["Área"]}
          editable
          inputType="multiselect"
          options={areasOptions}
          onSave={async (newIds) => {
            try {
              const updated = await updateProject(project.id, {
                area_ids: newIds.map(Number),
              });
              onProjectUpdate(updated);
              notifySuccess("Áreas actualizadas");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() =>
            project.areas.length ? (
              <div className="flex flex-col gap-1">
                {project.areas.map((a) => (
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
          renderDisplay={formatDate}
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
          renderDisplay={formatDate}
        />
        <DataRow
          label="Herramientas"
          value={project.tools.map((t) => t.id.toString())}
          icon={PROJECT_ICONS["Herramientas"]}
          editable
          inputType="multiselect"
          options={toolsOptions}
          onSave={async (newIds) => {
            try {
              const updated = await updateProject(project.id, {
                tool_ids: newIds.map(Number),
              });
              onProjectUpdate(updated);
              notifySuccess("Herramientas actualizadas");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() =>
            project.tools.length ? (
              <div className="flex flex-col gap-1">
                {project.tools.map((t) => (
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
          value={project.repositories.map((r) => r.id.toString())}
          icon={PROJECT_ICONS["Repositorios"]}
          editable
          inputType="multiselect"
          options={repositoriesOptions}
          onSave={async (newIds) => {
            try {
              const updated = await updateProject(project.id, {
                repository_ids: newIds.map(Number),
              });
              onProjectUpdate(updated);
              notifySuccess("Repositorios actualizados");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() =>
            project.repositories.length ? (
              <div className="flex flex-col gap-1">
                {project.repositories.map((r) => (
                  <a
                    key={r.id}
                    href={r.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline hover:text-purple-800"
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
