import api from '../api';
import { Tool } from '../../types/tools/Tool';

export const getTools = async (): Promise<Tool[]> => {
  const { data } = await api.get<Tool[]>('/tools/');
  return data;
};

export const getToolById = async (id: number): Promise<Tool> => {
  const { data } = await api.get<Tool>(`/tools/${id}/`);
  return data;
};

export const createTool = async (tool: { name: string; image: File | null }) => {
  const formData = new FormData();
  formData.append("name", tool.name);
  if (tool.image) {
    formData.append("image", tool.image);
  }

  const { data } = await api.post('/tools/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteTool = async (id: number) => {
  await api.delete(`/tools/${id}/`);
};

export async function updateTool(id: number, data: { name?: string; image?: File | null }) {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.image) formData.append("image", data.image);

  const response = await api.patch(`/tools/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}