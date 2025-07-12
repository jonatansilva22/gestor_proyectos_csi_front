import axios from 'axios';
import { Group } from '../../types/groups/Group';
import { User } from '../../types/user';

const API_URL = import.meta.env.VITE_API_URL;

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await axios.get<Group[]>(`${API_URL}/groups/`);
  return data;
};

export const getGroupById = async (id: number): Promise<Group> => {
  const { data } = await axios.get<Group>(`${API_URL}/groups/${id}/`);
  return data;
};

export const createGroup = async (group: { name: string; user_ids: number[] }) => {
  const { data } = await axios.post(`${API_URL}/groups/`, group, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const updateGroup = async (id: number, group: { name: string; user_ids: number[] }) => {
  const { data } = await axios.patch(`${API_URL}/groups/${id}/`, group, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const deleteGroup = async (id: number) => {
  await axios.delete(`${API_URL}/groups/${id}/`);
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(`${API_URL}/create-user/`);
  return data;
};
