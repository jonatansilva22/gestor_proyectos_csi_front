import axios from 'axios';
import { Area } from '../../types/areas/Area';

const API_URL = import.meta.env.VITE_API_URL;

export const getAreas = async (): Promise<Area[]> => {
  const { data } = await axios.get<Area[]>(`${API_URL}/areas/`);
  return data;
};

export const getAreaById = async (id: number): Promise<Area> => {
  const { data } = await axios.get<Area>(`${API_URL}/areas/${id}/`);
  return data;
};

export const createArea = async (area: { name: string }) => {
  const { data } = await axios.post(`${API_URL}/areas/`, area, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const deleteArea = async (id: number) => {
  await axios.delete(`${API_URL}/areas/${id}/`);
};

export async function updateArea(id: number, data: Partial<Area>) {
  const response = await axios.patch(`${API_URL}/areas/${id}/`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}