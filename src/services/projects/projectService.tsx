import axios from 'axios';
import { Project, Area, Tool, Repository, Group } from '../../types/projects/Project';

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

export const updateProject = async (id: number, data: any) => {
  // Detectar si es FormData para setear headers correcto
  const isFormData = data instanceof FormData;
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  const { data: response } = await axios.patch(`${API_URL}/projects/${id}/`, data, {
    headers,
  });
  return response;
};

export const getStatusTypes = async (): Promise<{ id: number; name: string }[]> => {
  const { data } = await axios.get<{ id: number; name: string }[]>(`${API_URL}/status-types/`);
  return data;
};

export const getAreas = async (): Promise<Area[]> => {
  const { data } = await axios.get<Area[]>(`${API_URL}/areas/`);
  return data;
};

export const getTools = async (): Promise<Tool[]> => {
  const { data } = await axios.get<Tool[]>(`${API_URL}/tools/`);
  return data;
};

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await axios.get<Group[]>(`${API_URL}/groups/`);
  return data;
};

export const getRepositories = async (): Promise<Repository[]> => {
  const { data } = await axios.get<Repository[]>(`${API_URL}/repositories/`);
  return data;
};
