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