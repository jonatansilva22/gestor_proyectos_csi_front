export interface Repository {
  id: number;
  name: string;
  repository_url: string;
  project: number;
  created_at: string;
  updated_at: string;
  index?: number;
}