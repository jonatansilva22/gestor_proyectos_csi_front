// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // Inicializa el estado con el valor actual de la media query
    // Esto evita el parpadeo inicial.
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false; // Valor por defecto para SSR o si window no está disponible
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Asegura que el estado esté actualizado después del montaje inicial o si la query cambia.
    setMatches(mediaQueryList.matches); 

    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]); // El efecto solo se re-ejecuta si la 'query' cambia.

  return matches;
}