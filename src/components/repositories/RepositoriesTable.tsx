import { Repository } from "../../types/repositories/Repository";
import borrar from "../../assets/borrar-icon.png";
import { EntityActions } from "../common/EntityActions";

interface RepositoriesTableProps {
  repositories: Repository[];
  onDeleteClick: (repository: Repository) => void;
  onEditClick: (repository: Repository) => void;
}

export const RepositoriesTable = ({
  repositories,
  onDeleteClick,
  onEditClick,
}: RepositoriesTableProps) => (
<table className="w-full min-w-[900px] border-collapse">
  <thead>
    <tr>
      <th className="px-4 py-2 text-left w-10">#</th>
      <th className="px-4 py-2 text-left w-48">Nombre</th>
      <th className="px-4 py-2 text-left w-96">URL del Repositorio</th>
      <th className="px-4 py-2 text-left w-20">Proyecto</th>
      <th className="px-4 py-2 text-center w-40">Fecha de creación</th>
      <th className="px-4 py-2 text-center w-40">Fecha de actualización</th>
      <th className="px-4 py-2 text-center w-32">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {repositories.map((repo, idx) => (
      <tr key={repo.id} className="border-t">
        <td className="px-4 py-7 w-10">{idx + 1}</td>
        <td className="px-4 py-7 w-48">{repo.name}</td>
<td className="px-4 py-7 align-top">
  <div className="max-w-[24rem] break-words whitespace-normal">
    <a
      href={repo.repository_url}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:underline break-words"
    >
      {repo.repository_url}
    </a>
  </div>
</td>
        <td className="px-4 py-7 w-20">{repo.project}</td>
        <td className="px-4 py-7 text-center w-40">
          {repo.created_at ? new Date(repo.created_at).toLocaleString() : "dd/mm/yyyy"}
        </td>
        <td className="px-4 py-7 text-center w-40">
          {repo.updated_at ? new Date(repo.updated_at).toLocaleString() : "dd/mm/yyyy"}
        </td>
        <td className="text-left w-60">
          <EntityActions
            onDelete={() => onDeleteClick(repo)}
            detailsLabel="Editar"
            deleteIcon={borrar}
            onDetails={() => onEditClick(repo)}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>

);
