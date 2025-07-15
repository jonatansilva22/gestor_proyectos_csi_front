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
  group: number;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
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
}

export interface Repository {
  id: number;
  name: string;
}
