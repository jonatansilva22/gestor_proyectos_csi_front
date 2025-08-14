import { useState } from "react";

export function useEntityModals<T = unknown>() {
  const [showModal, setShowModal] = useState(false); // Crear
  const [editModalOpen, setEditModalOpen] = useState(false); // Editar
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Eliminar
  const [entityToDelete, setEntityToDelete] = useState<T | null>(null);
  const [entityToEdit, setEntityToEdit] = useState<T | null>(null);

  // Crear
  const openCreateModal = () => setShowModal(true);
  const closeCreateModal = () => setShowModal(false);

  // Editar
  const openEditModal = (entity: T) => {
    setEntityToEdit(entity);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEntityToEdit(null);
  };

  // Eliminar
  const openDeleteModal = (entity: T) => {
    setEntityToDelete(entity);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setEntityToDelete(null);
  };

  return {
    // Crear
    showModal,
    openCreateModal,
    closeCreateModal,
    // Editar
    editModalOpen,
    openEditModal,
    closeEditModal,
    entityToEdit,
    setEntityToEdit,
    // Eliminar
    deleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    entityToDelete,
    setEntityToDelete,
  };
}
