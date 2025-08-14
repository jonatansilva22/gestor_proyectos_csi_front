import api from '../api';
import { Group } from '../../types/groups/Group';
import { User } from '../../types/user';

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await api.get<Group[]>('/groups/');
  return data;
};

export const getGroupById = async (id: number): Promise<Group> => {
  const { data } = await api.get<Group>(`/groups/${id}/`);
  return data;
};

export const createGroup = async (group: { name: string; user_ids: number[] }) => {
  const { data } = await api.post('/groups/', group, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const updateGroup = async (id: number, group: { name: string; user_ids: number[] }) => {
  const { data } = await api.patch(`/groups/${id}/`, group, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

export const deleteGroup = async (id: number) => {
  await api.delete(`/groups/${id}/`);
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/create-user/');
  return data;
};