import { Project } from "../../types/projects/Project";
import { ProjectActions } from "./ProjectActions";
import placeholder from "../../assets/placeholder.png";
import { PROJECT_STATUS_COLORS_TEXT } from "../../const/projectsStatusColors";

interface ProjectsTableProps {
  projects: Project[];
  onDeleteClick: (project: Project) => void;
}

export const ProjectsTable = ({ projects, onDeleteClick }: ProjectsTableProps) => (
  <div className="w-full overflow-x-auto">
    <table className="w-full table-fixed min-w-[700px]">
      <thead>
        <tr className="border-b">
          <th className="w-12 py-4 text-center">#</th>
          <th className="w-32 py-4 text-center">Imágen</th>
          <th className="w-[200px] md:w-[320px] py-4 text-center">Nombre</th>
          <th className="w-32 md:w-40 py-4 text-left">Estatus</th>
          <th className="w-32 md:w-40 py-4 text-left">Fecha inicio</th>
          <th className="w-32 md:w-40 py-4 text-left">Fecha final</th>
          <th className="w-40 md:w-48 py-4 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, idx) => (
          <tr key={project.id} className="border-b">
            <td className="w-12 py-4 text-center">{idx + 1}</td>
            <td className="w-32 py-4 text-center">
              <div className="w-24 h-20 flex items-center justify-center bg-gray-200 rounded-lg mx-auto">
                <img
                  src={project.image || placeholder}
                  alt="Proyecto"
                  className="object-contain w-16 h-16"
                />
              </div>
            </td>
            <td className="w-[200px] md:w-[320px] py-4 text-center">
              {project.name}
            </td>
            <td className="w-32 md:w-40 py-4 text-left">
              <span
                className={`font-semibold ${
                  PROJECT_STATUS_COLORS_TEXT[project.status.name]}`}
              >
                {project.status.name}
              </span>
            </td>
            <td className="w-32 md:w-40 py-4 text-left">
              {new Date(project.start_date).toLocaleDateString("es-MX")}
            </td>
            <td className="w-32 md:w-40 py-4 text-left">
              {new Date(project.end_date).toLocaleDateString("es-MX")}
            </td>
            <td className="w-40 md:w-48 py-4 text-center">
              <ProjectActions
                projectId={project.id}
                onDelete={() => onDeleteClick(project)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);