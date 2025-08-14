export interface ProjectStatus {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  image: string | null;
  description: string;
  project_owner: number;
  group: Group | number | null;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
  index?: number;
  tools?: Tool[];
  area?: Area;
  areas?: Area[];
  repositories?: Repository[];
  users?: any[];
}

export interface Area {
  id: number;
  name: string;
}

export interface Tool {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  users?: any[];
}

export interface Repository {
  id: number;
  name: string;
}