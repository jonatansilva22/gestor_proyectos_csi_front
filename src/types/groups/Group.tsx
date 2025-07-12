export interface GroupUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Group {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  users: GroupUser[];
}
