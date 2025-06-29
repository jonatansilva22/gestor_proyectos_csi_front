export interface Tool {
  id: number;
  name: string;
  image: string; 
  created_at: string;
  updated_at: string;
}

export interface ToolFormValues {
  name: string;
  image: File | null;
}
