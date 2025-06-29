import axios from 'axios';
import { Repository } from '../../types/repositories/Repository';

const API_URL = import.meta.env.VITE_API_URL;

export const getRepositories = async (): Promise<Repository[]> => {
  const { data } = await axios.get<Repository[]>(`${API_URL}/repositories/`);
  return data;
};

export const getRepositoryById = async (id: number): Promise<Repository> => {
  const { data } = await axios.get<Repository>(`${API_URL}/repositories/${id}/`);
  return data;
};

export const createRepository = async (repository: {
  name: string;
  repository_url: string;
  project: number;
}) => {
  const { data } = await axios.post(`${API_URL}/repositories/`, repository, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const updateRepository = async (
  id: number,
  repository: Partial<Repository>
) => {
  const { data } = await axios.patch(`${API_URL}/repositories/${id}/`, repository, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const deleteRepository = async (id: number) => {
  await axios.delete(`${API_URL}/repositories/${id}/`);
};
