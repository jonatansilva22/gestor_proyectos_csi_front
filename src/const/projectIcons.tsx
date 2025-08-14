import encargado from '../assets/encargado.png';
import grupo from '../assets/grupo.png';
import colaboradores from '../assets/colaboradores.png';
import estado from '../assets/estado.png';
import area from '../assets/area.png';
import fecha from '../assets/fecha.png';
import herramientas from '../assets/herramientas.png';
import repositorios from '../assets/repositorios.png';

export const PROJECT_ICONS = {
  Encargado: encargado,
  Grupo: grupo,
  Colaboradores: colaboradores,
  'Estado del proyecto': estado,
  Área: area,
  Herramientas: herramientas,
  Repositorios: repositorios,
  'Fecha de inicio': fecha,
  'Fecha final estimada': fecha,
} as const;

export type ProjectLabel = keyof typeof PROJECT_ICONS;