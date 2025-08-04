import { Project } from '../../types/projects/Project';
import { PROJECT_STATUS_COLORS_BG } from '../../const/projectsStatusColors';
import { PROJECT_ICONS } from '../../const/projectIcons'; // <--- Importa aquí
import { DataRow } from './DataRow';
import { updateProject } from '../../services/projects/projectService';
import { notifySuccess, notifyError } from '../common/ToastNotify';
import { getBackendErrorMsg } from '../../utils/projects/getBackendErrorMsg';
import { formatDate } from '../../utils/projects/formatDate';
import { getDateInputValue } from '../../utils/projects/dateHelpers';
import { useStatusOptions } from '../../hooks/projects/useStatusOptions';

interface ProjectDataTableProps {
  project: Project;
  onProjectUpdate: (p: Project) => void;
}

export const ProjectDataTable = ({ project, onProjectUpdate }: ProjectDataTableProps) => {
  const statusOptions = useStatusOptions();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b">
        <h2 className="font-semibold text-lg sm:text-xl text-gray-900">Datos del proyecto</h2>
      </div>
      <div className="divide-y divide-gray-200">
        <DataRow label="Encargado" value={project.project_owner ? String(project.project_owner) : 'No disponible'} icon={PROJECT_ICONS["Encargado"]} />
        <DataRow label="Grupo" value={project.group ? String(project.group) : 'No disponible'} icon={PROJECT_ICONS["Grupo"]} />
        <DataRow label="Colaboradores" value="No disponible" icon={PROJECT_ICONS["Colaboradores"]} />
        <DataRow
          label="Estado del proyecto"
          value={project.status.id.toString()}
          icon={PROJECT_ICONS["Estado del proyecto"]}
          editable
          inputType="select"
          options={statusOptions}
          onSave={async (newStatusId) => {
            try {
              const updated = await updateProject(
                project.id,
                { status_id: Number(newStatusId) } as any
              );
              onProjectUpdate(updated);
              notifySuccess("Estado actualizado");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={() => project.status.name}
          colorDot={PROJECT_STATUS_COLORS_BG[project.status.name] || 'bg-gray-400'}
        />
        <DataRow label="Área" value="No disponible" icon={PROJECT_ICONS["Área"]} />
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
              notifyError("La fecha de inicio no puede ser mayor que la fecha final");
              return;
            }
            try {
              const updated = await updateProject(project.id, { start_date: newDate });
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
              notifyError("La fecha final no puede ser menor que la fecha de inicio");
              return;
            }
            try {
              const updated = await updateProject(project.id, { end_date: newDate });
              onProjectUpdate(updated);
              notifySuccess("Fecha actualizada");
            } catch (e: any) {
              notifyError(getBackendErrorMsg(e));
            }
          }}
          renderDisplay={formatDate}
        />
        <DataRow label="Herramientas" value="No disponible" icon={PROJECT_ICONS["Herramientas"]} />
        <DataRow label="Repositorios" value="No disponible" icon={PROJECT_ICONS["Repositorios"]} />
      </div>
    </div>
  );
};