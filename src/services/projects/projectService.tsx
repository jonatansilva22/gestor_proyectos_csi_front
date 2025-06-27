import axios from 'axios';
import { Project } from '../../types/projects/Project';

const API_URL = import.meta.env.VITE_API_URL;

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get<Project[]>(`${API_URL}/projects/`);
  return data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const { data } = await axios.get<Project>(`${API_URL}/projects/${id}/`);
  return data;
};

export const createProject = async (project: FormData) => {
  const { data } = await axios.post(`${API_URL}/projects/`, project, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProject = async (id: number) => {
  await axios.delete(`${API_URL}/projects/${id}/`);
};

export async function updateProject(id: number, data: Partial<Project>) {
  const response = await axios.patch(`${API_URL}/projects/${id}/`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const getStatusTypes = async (): Promise<{ id: number; name: string }[]> => {
  const { data } = await axios.get<{ id: number; name: string }[]>(`${API_URL}/status-types/`);
  return data;
};