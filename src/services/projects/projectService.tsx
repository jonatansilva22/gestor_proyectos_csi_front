import api from '../api';
import { Project, Area, Tool, Repository, Group } from '../../types/projects/Project';

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>('/projects/');
  return data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const { data } = await api.get<Project>(`/projects/${id}/`);
  return data;
};

export const createProject = async (project: FormData) => {
  const { data } = await api.post('/projects/', project, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProject = async (id: number) => {
  await api.delete(`/projects/${id}/`);
};

export const updateProject = async (id: number, data: any) => {
  // Detectar si es FormData para setear headers correcto
  const isFormData = data instanceof FormData;
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  const { data: response } = await api.patch(`/projects/${id}/`, data, {
    headers,
  });
  return response;
};

export const getStatusTypes = async (): Promise<{ id: number; name: string }[]> => {
  const { data } = await api.get<{ id: number; name: string }[]>('/status-types/');
  return data;
};

export const getAreas = async (): Promise<Area[]> => {
  const { data } = await api.get<Area[]>('/areas/');
  return data;
};

export const getTools = async (): Promise<Tool[]> => {
  const { data } = await api.get<Tool[]>('/tools/');
  return data;
};

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await api.get<Group[]>('/groups/');
  return data;
};

export const getRepositories = async (): Promise<Repository[]> => {
  const { data } = await api.get<Repository[]>('/repositories/');
  return data;
};