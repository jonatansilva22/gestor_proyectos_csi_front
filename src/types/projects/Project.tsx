// src/types/projects/Project.tsx
// Tipos relacionados con la gestión de proyectos del sistema CSI

/**
 * Estado de un proyecto
 * Define los posibles estados en los que puede estar un proyecto
 */
export interface ProjectStatus {
  id: number;     // ID único del estado
  name: string;   // Nombre del estado (ej: "En Progreso", "Completado", "Pausado")
}

/**
 * Proyecto del sistema CSI
 * Representa un proyecto de investigación o desarrollo
 */
export interface Project {
  id: number;                    // ID único del proyecto
  name: string;                  // Nombre del proyecto
  image: string | null;          // URL de la imagen del proyecto (opcional)
  description: string;           // Descripción detallada del proyecto
  project_owner: number;         // ID del propietario del proyecto
  group: number;                 // ID del grupo al que pertenece
  status: ProjectStatus;         // Estado actual del proyecto
  start_date: string;            // Fecha de inicio (formato ISO)
  end_date: string;              // Fecha de finalización (formato ISO)
}