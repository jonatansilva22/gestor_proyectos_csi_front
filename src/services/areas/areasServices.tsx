import api from '../api';
import { Area } from '../../types/areas/Area';

export const getAreas = async (): Promise<Area[]> => {
  const { data } = await api.get<Area[]>('/areas/');
  return data;
};

export const getAreaById = async (id: number): Promise<Area> => {
  const { data } = await api.get<Area>(`/areas/${id}/`);
  return data;
};

export const createArea = async (area: { name: string }) => {
  const { data } = await api.post('/areas/', area, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const deleteArea = async (id: number) => {
  await api.delete(`/areas/${id}/`);
};

export async function updateArea(id: number, data: Partial<Area>) {
  const response = await api.patch(`/areas/${id}/`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}