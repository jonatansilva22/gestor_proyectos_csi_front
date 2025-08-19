import api from '../api';
import { Repository } from '../../types/repositories/Repository';

export const getRepositories = async (): Promise<Repository[]> => {
  const { data } = await api.get<Repository[]>('/repositories/');
  return data;
};

export const getRepositoryById = async (id: number): Promise<Repository> => {
  const { data } = await api.get<Repository>(`/repositories/${id}/`);
  return data;
};

export const createRepository = async (repository: {
  name: string;
  repository_url: string;
}) => {
  const { data } = await api.post('/repositories/', repository, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const updateRepository = async (
  id: number,
  repository: Partial<Repository>
) => {
  const { data } = await api.patch(`/repositories/${id}/`, repository, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const deleteRepository = async (id: number) => {
  await api.delete(`/repositories/${id}/`);
};