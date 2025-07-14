import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Group } from "../../types/groups/Group";
import { getGroups, createGroup, updateGroup, deleteGroup, getUsers } from "../../services/groups/groupsServices";

import { Header } from "../../components/common/Header";
import { Modal } from "../../components/common/Modal";
import { NewItemButton } from "../../components/common/NewItemButton";
import { GroupsTable } from "../../components/groups/GroupsTable";
import { GroupForm } from "../../components/groups/GroupForm";
import { DeleteGroupModal } from "../../components/groups/DeleteGroupModal";

import { notifySuccess, notifyError } from "../../components/common/ToastNotify";
import { getBackendErrorMsg } from "../../utils/projects/getBackendErrorMsg";

import { User } from "../../types/user";

import volver from "../../assets/volver.png";

export const GroupsTablePage = () => {
  const navigate = useNavigate();

  // Estados
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  // Cargar grupos
  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios disponibles
  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setAvailableUsers(usersData);
    } catch (error) {
      notifyError("Error cargando usuarios");
    }
  };

  // Cargar datos al montar componente
  useEffect(() => {
    loadGroups();
    loadUsers();
  }, []);

  // Crear grupo
  const handleCreateSubmit = async (data: { name: string; user_ids: number[] }) => {
    try {
      await createGroup(data);
      notifySuccess("Grupo creado exitosamente");
      setShowCreateModal(false);
      loadGroups();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  // Editar grupo
  const handleEditSubmit = async (data: { name: string; user_ids: number[] }) => {
    if (!groupToEdit) return;
    try {
      await updateGroup(groupToEdit.id, data);
      notifySuccess("Grupo actualizado exitosamente");
      setShowEditModal(false);
      setGroupToEdit(null);
      loadGroups();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  // Eliminar grupo
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await deleteGroup(groupToDelete.id);
      notifySuccess("Grupo eliminado exitosamente");
      setShowDeleteModal(false);
      setGroupToDelete(null);
      loadGroups();
    } catch (error: any) {
      notifyError(getBackendErrorMsg(error));
    }
  };

  return (
    <>
      <Header title="CSI PRO" />
      <div className="p-4 w-full h-full min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition"
          >
            <img src={volver} alt="Volver" className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Grupos</h2>

          <div className="overflow-y-auto max-h-[750px]">
            {loading ? (
              <p>Cargando grupos...</p>
            ) : (
              <GroupsTable
                groups={groups}
                onEditClick={(group) => {
                  setGroupToEdit(group);
                  setShowEditModal(true);
                }}
                onDeleteClick={(group) => {
                  setGroupToDelete(group);
                  setShowDeleteModal(true);
                }}
              />
            )}
          </div>

          <div className="mt-6">
            <NewItemButton label="Nuevo Grupo" onClick={() => setShowCreateModal(true)} />
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nuevo Grupo">
        <GroupForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreateModal(false)}
          availableUsers={availableUsers}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Grupo">
        {groupToEdit && (
          <GroupForm
            initialData={groupToEdit}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditModal(false)}
            availableUsers={availableUsers}
          />
        )}
      </Modal>

      {/* Modal Eliminar */}
      <DeleteGroupModal
        open={showDeleteModal}
        group={groupToDelete}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
