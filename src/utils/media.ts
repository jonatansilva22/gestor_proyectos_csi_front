// src/utils/media.ts
const API_URL = import.meta.env.VITE_API_URL;

const getApiOrigin = (): string => {
  if (!API_URL) {
    throw new Error('VITE_API_URL no está configurado en las variables de entorno');
  }
  try {
    // Remove trailing "/api" if present
    const origin = API_URL.replace(/\/?api\/?$/i, '').replace(/\/$/, '');
    return origin;
  } catch {
    throw new Error('Error al procesar VITE_API_URL');
  }
};

export const toMediaUrl = (path?: string | null): string | null => {
  if (!path) return null;
  // Already absolute
  if (/^https?:\/\//i.test(path)) return path;
  const origin = getApiOrigin();
  // If it already starts with /media, just prefix origin
  if (path.startsWith('/')) {
    return `${origin}${path}`;
  }
  // Otherwise assume it's a relative media path
  return `${origin}/media/${path.replace(/^\/?(media\/?)/i, '')}`;
};

export const apiOrigin = getApiOrigin();

