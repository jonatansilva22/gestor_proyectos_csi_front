import axios from 'axios';
import { Tool } from '../../types/tools/Tool';

const API_URL = import.meta.env.VITE_API_URL;

export const getTools = async (): Promise<Tool[]> => {
  const { data } = await axios.get<Tool[]>(`${API_URL}/tools/`);
  return data;
};

export const getToolById = async (id: number): Promise<Tool> => {
  const { data } = await axios.get<Tool>(`${API_URL}/tools/${id}/`);
  return data;
};

export const createTool = async (tool: { name: string; image: File | null }) => {
  const formData = new FormData();
  formData.append("name", tool.name);
  if (tool.image) {
    formData.append("image", tool.image);
  }

  const { data } = await axios.post(`${API_URL}/tools/`, formData);
  return data;
};

export const deleteTool = async (id: number) => {
  await axios.delete(`${API_URL}/tools/${id}/`);
};

export async function updateTool(id: number, data: { name?: string; image?: File | null }) {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.image) formData.append("image", data.image);

  const response = await axios.patch(`${API_URL}/tools/${id}/`, formData);
  return response.data;
}
