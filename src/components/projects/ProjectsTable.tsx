import { Project } from "../../types/projects/Project";
import { ProjectActions } from "./ProjectActions";
import placeholder from "../../assets/placeholder.png";
import { PROJECT_STATUS_COLORS_TEXT } from "../../const/projectsStatusColors";

interface ProjectsTableProps {
  projects: Project[];
  onDeleteClick: (project: Project) => void;
}

export const ProjectsTable = ({ projects, onDeleteClick }: ProjectsTableProps) => (
  <>
    {/* Desktop Table - Hidden on mobile */}
    <div className="hidden lg:block w-full overflow-x-auto">
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

    {/* Mobile Card View - Visible only on mobile */}
    <div className="lg:hidden space-y-4">
      {projects.map((project, idx) => (
        <div key={project.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg">
                <img
                  src={project.image || placeholder}
                  alt="Proyecto"
                  className="object-contain w-12 h-12"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate pr-2">
                  {project.name}
                </h3>
                <span className="text-sm text-gray-500 flex-shrink-0">#{idx + 1}</span>
              </div>
              <div className="mb-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    PROJECT_STATUS_COLORS_TEXT[project.status.name]}`}
                >
                  {project.status.name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500 block">Fecha inicio:</span>
              <span className="font-medium">
                {new Date(project.start_date).toLocaleDateString("es-MX")}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Fecha final:</span>
              <span className="font-medium">
                {new Date(project.end_date).toLocaleDateString("es-MX")}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <ProjectActions
              projectId={project.id}
              onDelete={() => onDeleteClick(project)}
            />
          </div>
        </div>
      ))}
    </div>
  </>
);