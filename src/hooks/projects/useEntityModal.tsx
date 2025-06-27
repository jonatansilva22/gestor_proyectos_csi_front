import { useState } from "react";

export function useEntityModals<T = unknown>() {
  const [showModal, setShowModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<T | null>(null);

  const openCreateModal = () => setShowModal(true);
  const closeCreateModal = () => setShowModal(false);

  const openDeleteModal = (entity: T) => {
    setEntityToDelete(entity);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setEntityToDelete(null);
  };

  return {
    showModal,
    openCreateModal,
    closeCreateModal,
    deleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    entityToDelete,
    setEntityToDelete,
  };
}